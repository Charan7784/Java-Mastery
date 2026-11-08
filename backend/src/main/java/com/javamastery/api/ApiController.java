package com.javamastery.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://java-mastery-1.onrender.com"
})
public class ApiController {

    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper;

    // Admin credentials
    private final String adminId = "Charan";
    private final String adminPassword = "REPLACE_WITH_YOUR_PASSWORD";

    private final SecureRandom random = new SecureRandom();
    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    public ApiController(JdbcTemplate jdbc, ObjectMapper mapper) {
        this.jdbc = jdbc;
        this.mapper = mapper;
    }

    public record Credentials(String email, String password) {}
    public record Registration(String fullName, String email, String password) {}
    public record AdminCredentials(String id, String password) {}
    public record Session(String token, Map<String, String> user) {}
    public record ResultRequest(int moduleId, int score, int totalQuestions) {}
    public record LearningRequest(List<String> completedTopicIds, List<String> bookmarkedTopicIds) {}
    public record Account(String id, String fullName, String email, String createdAt, String salt, String passwordHash) {}
    public record QuizResult(String id, String userId, String userEmail, int moduleId, String topicTitle,
                             int score, int totalQuestions, String attemptedAt) {}
    public record LoginEvent(String id, String userId, String email, String loggedAt) {}
    public record Learning(List<String> completedTopicIds, List<String> bookmarkedTopicIds) {}

    private static final List<String> MODULE_TITLES = List.of(
        "Introduction to Java", "Variables and Data Types", "Operators", "Input and Output",
        "Conditional Statements", "Loops and Number Programs", "Pattern Programming", "Arrays",
        "Strings", "Methods", "Classes and Objects", "Object-Oriented Programming",
        "Access Modifiers and Keywords", "Packages", "Exception Handling", "Wrapper Classes",
        "Collections Framework", "Advanced Core Java"
    );

    private Account account(String id) {
        List<Account> found = jdbc.query(
            "SELECT id, full_name, email, created_at, password_salt, password_hash FROM app_user WHERE id = ?",
            (rs, row) -> new Account(
                rs.getString("id"),
                rs.getString("full_name"),
                rs.getString("email"),
                rs.getString("created_at"),
                rs.getString("password_salt"),
                rs.getString("password_hash")
            ),
            id
        );

        if (found.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Account no longer exists. Please register again."
            );
        }

        return found.get(0);
    }

    private Account publicAccount(Account a) {
        return new Account(
            a.id(), a.fullName(), a.email(), a.createdAt(), null, null
        );
    }

    private Map<String, String> publicUser(Account a) {
        return Map.of(
            "id", a.id(),
            "fullName", a.fullName(),
            "email", a.email(),
            "createdAt", a.createdAt()
        );
    }

    private String tokenFrom(String authorization) {
        return authorization == null
            ? ""
            : authorization.replaceFirst("(?i)^Bearer\\s+", "");
    }

    private Account requireUser(String authorization) {
        String id = sessions.get(tokenFrom(authorization));

        if (id == null || id.equals("ADMIN")) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Please sign in again."
            );
        }

        return account(id);
    }

    private void requireAdmin(String authorization) {
        if (!"ADMIN".equals(sessions.get(tokenFrom(authorization)))) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Admin sign in required."
            );
        }
    }

    private Session newSession(String identity, Map<String, String> user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, identity);
        return new Session(token, user);
    }

    private String passwordHash(String password, byte[] salt) {
        try {
            PBEKeySpec spec = new PBEKeySpec(
                password.toCharArray(), salt, 210_000, 256
            );

            byte[] bytes = SecretKeyFactory
                .getInstance("PBKDF2WithHmacSHA256")
                .generateSecret(spec)
                .getEncoded();

            spec.clearPassword();

            return Base64.getEncoder().encodeToString(bytes);

        } catch (Exception e) {
            throw new IllegalStateException(
                "Password hashing is unavailable.", e
            );
        }
    }

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> register(@RequestBody Registration request) {

        if (request.fullName() == null || request.fullName().isBlank()
            || request.email() == null || request.email().isBlank()
            || request.password() == null || request.password().length() < 8) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Enter your name, email, and a password with at least 8 characters."
            );
        }

        String email = request.email().trim().toLowerCase(Locale.ROOT);

        byte[] salt = new byte[16];
        random.nextBytes(salt);

        Account user = new Account(
            UUID.randomUUID().toString(),
            request.fullName().trim(),
            email,
            Instant.now().toString(),
            Base64.getEncoder().encodeToString(salt),
            passwordHash(request.password(), salt)
        );

        try {
            jdbc.update(
                "INSERT INTO app_user (id, full_name, email, created_at, password_salt, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
                user.id(), user.fullName(), user.email(),
                user.createdAt(), user.salt(), user.passwordHash()
            );

        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "An account with this email already exists."
            );
        }

        return publicUser(user);
    }

    @PostMapping("/auth/login")
    public Session login(@RequestBody Credentials request) {

        String email = request.email() == null
            ? ""
            : request.email().trim().toLowerCase(Locale.ROOT);

        List<Account> found = jdbc.query(
            "SELECT id, full_name, email, created_at, password_salt, password_hash FROM app_user WHERE email = ?",
            (rs, row) -> new Account(
                rs.getString("id"),
                rs.getString("full_name"),
                rs.getString("email"),
                rs.getString("created_at"),
                rs.getString("password_salt"),
                rs.getString("password_hash")
            ),
            email
        );

        if (found.isEmpty() || request.password() == null) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Email or password is incorrect."
            );
        }

        Account user = found.get(0);

        byte[] salt = Base64.getDecoder().decode(user.salt());

        if (!passwordHash(request.password(), salt).equals(user.passwordHash())) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Email or password is incorrect."
            );
        }

        jdbc.update(
            "INSERT INTO login_event (id, user_id, email, logged_at) VALUES (?, ?, ?, ?)",
            UUID.randomUUID().toString(),
            user.id(),
            user.email(),
            Instant.now().toString()
        );

        return newSession(user.id(), publicUser(user));
    }

    @PostMapping("/admin/login")
    public Session adminLogin(@RequestBody AdminCredentials request) {

        if (request == null
            || request.id() == null
            || request.password() == null
            || adminPassword.isBlank()
            || !adminId.equals(request.id())
            || !adminPassword.equals(request.password())) {

            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Admin ID or password is incorrect."
            );
        }

        return newSession(
            "ADMIN",
            Map.of(
                "id", "admin",
                "fullName", adminId,
                "email", adminId,
                "createdAt", ""
            )
        );
    }

    @GetMapping("/auth/me")
    public Map<String, String> me(
        @RequestHeader(value = "Authorization", required = false)
        String authorization
    ) {
        return publicUser(requireUser(authorization));
    }

    @PostMapping("/auth/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
        @RequestHeader(value = "Authorization", required = false)
        String authorization
    ) {
        sessions.remove(tokenFrom(authorization));
    }

    @GetMapping("/auth/has-users")
    public Map<String, Boolean> hasUsers() {

        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM app_user",
            Integer.class
        );

        return Map.of("hasUsers", count != null && count > 0);
    }

    @GetMapping("/learning")
    public Learning getLearning(
        @RequestHeader(value = "Authorization", required = false)
        String authorization
    ) {

        String userId = requireUser(authorization).id();

        List<Learning> rows = jdbc.query(
            "SELECT completed_topic_ids, bookmarked_topic_ids FROM learning_record WHERE user_id = ?",
            (rs, row) -> new Learning(
                readIds(rs.getString("completed_topic_ids")),
                readIds(rs.getString("bookmarked_topic_ids"))
            ),
            userId
        );

        return rows.isEmpty()
            ? new Learning(List.of(), List.of())
            : rows.get(0);
    }

    private List<String> readIds(String json) {
        try {
            return mapper.readValue(
                json,
                new TypeReference<>() {}
            );
        } catch (Exception e) {
            return List.of();
        }
    }

    @PutMapping("/learning")
    public Learning saveLearning(
        @RequestHeader(value = "Authorization", required = false)
        String authorization,
        @RequestBody LearningRequest request
    ) {

        String userId = requireUser(authorization).id();

        List<String> completed =
            request.completedTopicIds() == null
                ? List.of()
                : request.completedTopicIds().stream().distinct().toList();

        List<String> bookmarks =
            request.bookmarkedTopicIds() == null
                ? List.of()
                : request.bookmarkedTopicIds().stream().distinct().toList();

        try {
            jdbc.update(
                "INSERT INTO learning_record (user_id, completed_topic_ids, bookmarked_topic_ids) VALUES (?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE completed_topic_ids = VALUES(completed_topic_ids), bookmarked_topic_ids = VALUES(bookmarked_topic_ids)",
                userId,
                mapper.writeValueAsString(completed),
                mapper.writeValueAsString(bookmarks)
            );

        } catch (Exception e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not save learning progress."
            );
        }

        return new Learning(completed, bookmarks);
    }

    @GetMapping("/quiz/results")
    public List<QuizResult> results(
        @RequestHeader(value = "Authorization", required = false)
        String authorization
    ) {

        String userId = requireUser(authorization).id();

        return jdbc.query(
            "SELECT * FROM quiz_result WHERE user_id = ? ORDER BY attempted_at DESC",
            (rs, row) -> new QuizResult(
                rs.getString("id"),
                rs.getString("user_id"),
                rs.getString("user_email"),
                rs.getInt("module_id"),
                rs.getString("topic_title"),
                rs.getInt("score"),
                rs.getInt("total_questions"),
                rs.getString("attempted_at")
            ),
            userId
        );
    }

    @PostMapping("/quiz/results")
    @ResponseStatus(HttpStatus.CREATED)
    public QuizResult saveResult(
        @RequestHeader(value = "Authorization", required = false)
        String authorization,
        @RequestBody ResultRequest request
    ) {

        Account user = requireUser(authorization);

        if (request.moduleId() < 1
            || request.moduleId() > MODULE_TITLES.size()
            || request.totalQuestions() != 10
            || request.score() < 0
            || request.score() > request.totalQuestions()) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid quiz result."
            );
        }

        QuizResult result = new QuizResult(
            UUID.randomUUID().toString(),
            user.id(),
            user.email(),
            request.moduleId(),
            MODULE_TITLES.get(request.moduleId() - 1),
            request.score(),
            request.totalQuestions(),
            Instant.now().toString()
        );

        jdbc.update(
            "INSERT INTO quiz_result (id, user_id, user_email, module_id, topic_title, score, total_questions, attempted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            result.id(),
            result.userId(),
            result.userEmail(),
            result.moduleId(),
            result.topicTitle(),
            result.score(),
            result.totalQuestions(),
            result.attemptedAt()
        );

        return result;
    }

    @GetMapping("/admin/snapshot")
    public Map<String, Object> snapshot(
        @RequestHeader(value = "Authorization", required = false)
        String authorization
    ) {

        requireAdmin(authorization);

        List<Map<String, String>> users = jdbc.query(
            "SELECT id, full_name, email, created_at FROM app_user ORDER BY created_at DESC",
            (rs, row) -> Map.of(
                "id", rs.getString("id"),
                "fullName", rs.getString("full_name"),
                "email", rs.getString("email"),
                "createdAt", rs.getString("created_at")
            )
        );

        List<LoginEvent> logins = jdbc.query(
            "SELECT id, user_id, email, logged_at FROM login_event ORDER BY logged_at DESC",
            (rs, row) -> new LoginEvent(
                rs.getString("id"),
                rs.getString("user_id"),
                rs.getString("email"),
                rs.getString("logged_at")
            )
        );

        List<QuizResult> results = jdbc.query(
            "SELECT * FROM quiz_result ORDER BY attempted_at DESC",
            (rs, row) -> new QuizResult(
                rs.getString("id"),
                rs.getString("user_id"),
                rs.getString("user_email"),
                rs.getInt("module_id"),
                rs.getString("topic_title"),
                rs.getInt("score"),
                rs.getInt("total_questions"),
                rs.getString("attempted_at")
            )
        );

        return Map.of(
            "users", users,
            "logins", logins,
            "quizResults", results
        );
    }

    @DeleteMapping("/admin/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(
        @RequestHeader(value = "Authorization", required = false)
        String authorization,
        @PathVariable String id
    ) {

        requireAdmin(authorization);

        jdbc.update(
            "DELETE FROM app_user WHERE id = ?",
            id
        );

        sessions.entrySet().removeIf(
            entry -> entry.getValue().equals(id)
        );
    }
}
