```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Environment   │───▸│  Feature Flag   │───▸│   Component     │
│   Configuration │    │   Evaluator     │    │   Behavior      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Environment   │    │   Probability   │    │   Conditional   │
│   Variables     │    │   Calculator    │    │   Rendering     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```