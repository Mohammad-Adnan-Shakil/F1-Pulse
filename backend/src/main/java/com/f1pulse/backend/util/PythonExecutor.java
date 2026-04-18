package com.f1pulse.backend.util;

import java.io.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PythonExecutor {

    public static JsonNode runScript(String scriptPath, String jsonInput) {
        try {
            ProcessBuilder pb = new ProcessBuilder("python", scriptPath);
            Process process = pb.start();

            // ✅ SEND JSON VIA STDIN
            BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream()));
            writer.write(jsonInput);
            writer.flush();
            writer.close();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            BufferedReader errorReader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()));

            StringBuilder output = new StringBuilder();
            StringBuilder errorOutput = new StringBuilder();

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            while ((line = errorReader.readLine()) != null) {
                errorOutput.append(line);
            }

            if (output.length() == 0) {
                throw new RuntimeException("Python script returned empty output: " + errorOutput);
            }

            System.out.println("PYTHON OUTPUT: " + output);

            return new ObjectMapper().readTree(output.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}