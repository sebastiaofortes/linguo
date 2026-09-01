# Linguo 🦉

Ambiente interativo de aprendizado de idiomas (Inglês 🇺🇸 e Espanhol 🇪🇸) guiado por Inteligência Artificial, inspirado na metodologia, psicologia de hábitos e no design system do Duolingo.

## 🚀 Funcionalidades Principais

- **Selector de Cursos e Idiomas:** Alterne instantaneamente entre **Inglês** e **Espanhol** clicando no ícone de bandeira na barra superior.
- **Trilhas em Zigue-Zague:** Progresso gamificado com unidades coloridas, popovers interativos e lições ativas/concluídas.
- **Áudio Nativo & Síntese de Voz:** Pronúncia clara e natural com Web Speech API em inglês (`en-US`) e espanhol (`es-ES`).
- **Modo Escuro / Claro:** Alternância suave de tema persistida no navegador.
- **Tutor AI Integrado:** Skill inteligente configurada em `.agents/skills/duo-english-tutor` para gerar novas aulas e exercícios sob demanda.

## 📁 Estrutura do Projeto

```text
linguo/
├── index.html                           # SPA principal com seletor de cursos
├── resources/
│   ├── duo-theme.css                    # Design System Feather (Duolingo)
│   └── duo-sfx.js                       # Web Audio API + Síntese de voz (EN & ES)
├── lessons/
│   ├── en/                              # 🇺🇸 Lições de Inglês
│   │   ├── lessons.json                 # Metadados e trilha de inglês
│   │   └── <lesson-slug>/
│   │       ├── explanation.html         # Página de teoria e conceitos visuais
│   │       └── exercise.html            # Exercícios práticos e gamificados
│   │
│   └── es/                              # 🇪🇸 Lecciones de Español
│       ├── lessons.json                 # Metadados y ruta de español
│       └── <lesson-slug>/
│           ├── explanation.html
│           └── exercise.html
│
└── .agents/
    └── skills/
        └── duo-english-tutor/           # Tutor AI (Inglês & Espanhol)
            └── SKILL.md
```

## 🛠️ Tecnologias
- HTML5 Semântico & Single Page Application
- Vanilla CSS (Design System Feather / Botões 3D Táteis)
- Web Audio API (Sons sintetizados de sucesso e erro)
- Web Speech API (Pronúncia nativa em inglês e espanhol)
