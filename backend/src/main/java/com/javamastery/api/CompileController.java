package com.javamastery.api;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class CompileController {
    private final RestClient judge0;
    private final String authHeader;
    private final String apiKey;
    private final int javaLanguageId;

    public CompileController(
            RestClient.Builder builder,
            @Value("${judge0.base-url:https://ce.judge0.com}") String judge0BaseUrl,
            @Value("${judge0.auth-header:X-Auth-Token}") String authHeader,
            @Value("${judge0.api-key:}") String apiKey,
            @Value("${judge0.java-language-id:62}") int javaLanguageId) {
        this.judge0 = builder.baseUrl(judge0BaseUrl).build();
        this.authHeader = authHeader;
        this.apiKey = apiKey;
        this.javaLanguageId = javaLanguageId;
    }

    @PostMapping(value = "/compile", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public CompileResponse compile(@RequestBody CompileRequest request) {
        if (request.sourceCode() == null || request.sourceCode().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sourceCode must not be empty");
        }

        try {
            Map<?, ?> submission = requestJudge0("/submissions?base64_encoded=false", Map.of(
                    "source_code", request.sourceCode(),
                    "language_id", javaLanguageId,
                    "stdin", request.stdin() == null ? "" : request.stdin()));
            Object tokenValue = submission.get("token");
            if (!(tokenValue instanceof String token) || token.isBlank()) {
                throw new IllegalStateException("Judge0 did not return a submission token");
            }

            Map<?, ?> result = null;
            long deadline = System.nanoTime() + Duration.ofSeconds(30).toNanos();
            while (System.nanoTime() < deadline) {
                result = requestJudge0("/submissions/" + token + "?base64_encoded=false&fields=stdout,stderr,compile_output,message,status", null);
                Object statusValue = result.get("status");
                Object statusId = statusValue instanceof Map<?, ?> statusMap ? statusMap.get("id") : null;
                if (statusId instanceof Number number && number.intValue() > 2) break;
                Thread.sleep(500);
            }
            if (result == null) throw new IllegalStateException("Judge0 returned no result");
            Object resultStatus = result.get("status");
            Object resultStatusId = resultStatus instanceof Map<?, ?> statusMap ? statusMap.get("id") : null;
            if (resultStatusId instanceof Number number && number.intValue() <= 2) {
                throw new IllegalStateException("Judge0 did not finish the submission within 30 seconds");
            }

            String status = resultStatus instanceof Map<?, ?> statusMap && statusMap.get("description") != null
                    ? String.valueOf(statusMap.get("description")) : "Completed";
            String output = firstText(result.get("stdout"), result.get("compile_output"), result.get("stderr"), result.get("message"));
            if (output == null) output = "Program executed with no output.";
            return new CompileResponse(output, status, null);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Compilation was interrupted", exception);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Compiler service request failed. Check the Judge0 URL, credentials, and availability.", exception);
        }
    }

    private Map<?, ?> requestJudge0(String path, Map<String, Object> body) {
        RestClient.RequestHeadersSpec<?> request = body == null
                ? judge0.get().uri(path)
                : judge0.post().uri(path).contentType(MediaType.APPLICATION_JSON).body(body);
        if (!apiKey.isBlank()) request = request.header(authHeader, apiKey);
        return request.retrieve().body(Map.class);
    }

    private String firstText(Object... values) {
        for (Object value : values) {
            if (value instanceof String text && !text.isBlank()) return text;
        }
        return null;
    }

    public record CompileRequest(String sourceCode, String stdin) {}
    public record CompileResponse(String output, String status, String message) {}
}
