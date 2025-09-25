# AI Agent SaaS for tracking receipts

### What an Agent includes:

- LLM
- Memory store
- Tools

<br><br><br>

### Tech stack

##### AI model

- [Anthropic](https://www.anthropic.com/)

- [OpenAI](https://openai.com/)

##### AI agentic workflow, debug, orchestration

- [Inngest](https://www.inngest.com/)

<br><br><br>

##### Frontend & Backend

- Nextjs

- Drag & Drop

- TailwindCSS

- Typescript

- Shadcn/ui: design system

<br><br><br>

##### Database

- [Convex](https://www.convex.dev/)

- automatically give features of typing

<br><br><br>

##### Authentication

- [Clerk](https://clerk.com/)

- authentication and more on user managements
- Use JWT(Json Web Token) for session

<br><br><br>

##### Pricing & Packaging

- [Schematic](https://schematichq.com/)<br>

- Handle payments throughout the entire app lifecycle
- Provide feature gating and user management capabilities

<br><br><br>

##### Payment solution

- [Stripe](https://stripe.com/)<br>

- Provide programmable APIs and tools for payment processing

<br><br><br>

### Roadmap

##### Primary tasks

- Add more information to database from receipt scanning: 영수증으로부터 추출가능한 정보의 확대
- Enhance the receipt scanning feature with giving more proper prompt to AI model: so far, it cannot properly scan and read information as discounts, usage fee at the moment of shopping: 영수증 스캔 기능 고도화하기 위해 프롬프트 메시지 수정하여 모델에 전달. 그러기 위해서 상단에 표시한 다른 메타정보 인식이 필요하고 관련 데이터를 데이터베이스 저장 필요.

##### Medium ranked tasks

- Add a feature for re-analyzing receipts due to the wrong AI-powered extraction: 모델 변경, 프롬프트 메세지 변경. 재분석 기능 제공.
- Add a feature for a toast messaing if a user tries to upload the same receipt which has been processed before: 사용자가 기존에 올렸던 영수증의 경우, 처리할 비지니스 로직 마련할 것.

##### Last but not least tasks

- Add a feature for extracting informations with divided receipt images: 긴 영수증을 분할 이미지로 업로드 후 해당 이미지 통합. 본 기능은 token 사용과다로 인한 고비용 작업으로 예상.
