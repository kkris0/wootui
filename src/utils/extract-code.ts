export function extractCode(response: string): string {
    // Regex explanation:
    // ```           -> Matches the opening triple backticks
    // (?:\w+)?      -> Optional non-capturing group for language id (e.g. "typescript")
    // \s*           -> Matches any whitespace (newlines) after the opening ticks
    // ([\s\S]*?)    -> Captures content (non-greedy), including newlines
    // \s*           -> Matches any trailing whitespace before the closing ticks
    // ```           -> Matches the closing triple backticks
    const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)\s*```/;

    const match = response.match(codeBlockRegex);

    // If a match is found, return the first capture group (the code inside).
    // Otherwise, return the original string (fallback).
    return match ? (match[1]?.trim() ?? '') : response.trim();
}
