package com.f1pulse.ai.integration;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Component
public class PythonExecutor {

    public String runPredictionScript(String inputJson) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "python",
                    "ml/predict.py",
                    inputJson
            );

            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Python script failed with exit code " + exitCode);
            }

            return output.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error executing Python script", e);
        }
    }
}