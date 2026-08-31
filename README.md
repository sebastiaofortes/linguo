# Linguo 🦉

Um ambiente de aprendizado de inglês guiado por Inteligência Artificial, inspirado na metodologia, psicologia de hábitos e no design system do Duolingo.

## 🚀 Como Funciona

O projeto conta com uma skill inteligente configurada em `.agents/skills/duo-english-tutor`:
1. **Definição de Meta:** A IA pergunta o foco do dia (conversação, gramática, negócios, viagem).
2. **Explicação Visual:** Gera uma página `explanation.html` com os cartões visuais do tema, exemplos com áudio falado nativo do navegador e balões do mascote.
3. **Prática Interativa:** Gera uma página `exercise.html` com banco de palavras táteis (*chunky 3D buttons*), múltipla escolha, efeitos sonoros (Web Audio API) e tela de celebração de ofensiva (*streak*).

## 📁 Estrutura do Projeto

```text
linguo/
├── .agents/
│   └── skills/
│       └── duo-english-tutor/
│           ├── SKILL.md                 # Instruções e fluxo do tutor AI
│           ├── resources/
│           │   ├── duo-theme.css        # Design System Feather (Duolingo)
│           │   └── duo-sfx.js           # Efeitos sonoros táteis e sintetizador de voz
│           └── templates/
│               ├── explanation.html     # Template da aula teórica
│               └── exercise.html        # Template da aula prática interativa
└── lessons/                             # Aulas geradas sob demanda
```

## 🛠️ Tecnologias
- HTML5 Semântico
- Vanilla CSS (Design System Feather / 3D pressable buttons)
- Web Audio API (Sons sintetizados de sucesso e erro)
- Web Speech API (Pronúncia nativa em inglês)
