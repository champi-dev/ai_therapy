# Software Engineering Principles and Development Philosophy

## Performance Standards

- ONLY use algorithms with O(1) or O(log n) time complexity. If O(n) or worse seems necessary, stop and redesign the entire approach
- Use hash tables, binary search, divide-and-conquer, and other advanced techniques to achieve optimal complexity
- Pre-compute and cache aggressively. Trade space for time when it improves complexity
- If a standard library function has suboptimal complexity, implement your own optimized version

## Code Quality Standards

- Every line must be intentional and elegant - no quick fixes or temporary solutions
- Use descriptive, self-documenting variable and function names
- Structure code with clear separation of concerns and single responsibility principle
- Implement comprehensive error handling with graceful degradation
- Add detailed comments explaining the "why" behind complex algorithms
- Follow language-specific best practices and idioms religiously

## Beauty and Craftsmanship

- Code should read like well-written prose - clear, flowing, and pleasant
- Maintain consistent formatting and style throughout
- Use design patterns appropriately to create extensible, maintainable solutions
- Refactor relentlessly until the code feels "right"
- Consider edge cases and handle them elegantly
- Write code as if it will be read by someone you deeply respect

## Development Process

- Think deeply before coding. Sketch out the optimal approach first
- If you catch yourself writing suboptimal code, delete it and start over
- Test with extreme cases to ensure correctness and performance
- Profile and measure to verify O(1) or O(log n) complexity
- Never say "this is good enough" - always push for perfection

## Collaboration and Project Guidelines

- Solve problems in minimal, small, verifiable, testable, manageable steps
- Test, verify, and provide solid evidence of each step
- Do not take shortcuts
- Provide honest communication about limitations
- Build lightweight functional versions of dependencies instead of installing new ones
- Respect linting rules
- Avoid using `no verify`
- Be smart about token usage
- Create systematic change tools and test thoroughly
- Never track or commit API keys or secrets
- Run `pwd` before changing directories
- Always clean and update documentation after changes
- Notify users and developers of errors
- Write comprehensive unit tests and E2E tests
- Aim for 100% test coverage

## Design System Philosophy

- Prioritize emotional wellness in digital interfaces
- Create minimalist, breathing spaces in design
- Implement micro-interactions that feel human and considerate
- Design with accessibility and inclusivity as core principles
- Use color, typography, and layout to guide and support user experience
- Build interfaces that adapt to user's emotional state
- Ensure technology dissolves into the background, emphasizing human connection

## API Development Principles

- Develop APIs with O(1) performance guarantees
- Implement eternal context mechanisms for seamless conversation retention
- Integrate intelligent web search and fact-checking capabilities
- Design secure, isolated session management
- Optimize for real-time streaming and minimal latency
- Create comprehensive metadata and context tracking
- Build robust error handling and graceful degradation mechanisms

Remember: You're not just solving a problem, you're creating a masterpiece that will stand as an example of engineering excellence. Every shortcut avoided is a victory for craftsmanship.
