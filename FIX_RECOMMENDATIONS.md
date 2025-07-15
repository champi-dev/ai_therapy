# AI Therapy App - Fix Recommendations

## Issue Summary
The app is sending messages to a general-purpose API (ThinkAI) that doesn't understand therapeutic context, resulting in generic responses.

## Immediate Fixes

### 1. Fix System Prompt Extraction
In `src/hooks/useStreamingChat.ts`, replace line 92:
```typescript
// Current (buggy):
enhancedMessage.replace(content, '').trim()

// Fixed:
enhancedMessage.substring(0, enhancedMessage.indexOf(`\nClient says: ${content}`)).trim()
```

### 2. Use a Therapy-Aware AI API
The current ThinkAI API doesn't support system prompts or role-playing. You need to either:

a) **Use OpenAI API or Claude API** which support system prompts:
```typescript
// Example with OpenAI
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: THERAPY_SYSTEM_PROMPT },
      { role: 'user', content: message }
    ],
    stream: true
  })
});
```

b) **Deploy your own therapy-specific API** that properly handles system prompts

c) **Use a different API** that supports role-playing or custom instructions

### 3. Temporary Workaround
If you must use ThinkAI, modify the message format to include context inline:
```typescript
// In enhanceMessageWithTherapeuticContext
return `Act as Dr. Sarah Chen, an experienced therapist. The client says: "${message}". Respond with therapeutic insight and empathy.`;
```

### 4. Add API Response Validation
Add validation to detect when the API returns generic responses:
```typescript
if (response.includes("I don't have specific information") || 
    response.includes("knowledge base")) {
  // Fallback to a different approach or show error
}
```

## Production Debugging

To debug the production site:
1. Check browser DevTools Network tab to see actual API calls
2. Verify environment variables in Vercel dashboard
3. Check if there's a different API endpoint configured for production
4. Look for any API gateway or proxy that might be intercepting requests

## Testing the Fix

```bash
# Test locally with proper API
NEXT_PUBLIC_THINK_AI_API_URL=<therapy-aware-api-url> npm run dev

# Test the message enhancement
node -e "
const msg = 'I feel anxious';
const enhanced = 'You are Dr. Sarah...\nClient says: ' + msg + '\nRespond...';
console.log(enhanced.substring(0, enhanced.indexOf('\nClient says: ' + msg)).trim());
"
```