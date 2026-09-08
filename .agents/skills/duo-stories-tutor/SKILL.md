---
name: duo-stories-tutor
description: >-
  Interactive Duolingo Stories Creator & Tutor (English 🇺🇸 & Spanish 🇪🇸). Generates
  immersive, dialogue-driven stories with characters, native TTS speech synthesis,
  mid-story comprehension checkpoints, word bank fill-ins, and final vocabulary
  matching pairs in stories/en/<slug>/index.html and stories/es/<slug>/index.html.
---

# Linguo Duo Stories Skill (Inglês 🇺🇸 & Espanhol 🇪🇸)

Esta skill atua como um roteirista pedagógico e desenvolvedor de Histórias Interativas para o Linguo inspiradas no formato consagrado do Duolingo Stories. Ela guia o usuário na escolha do idioma, nível e tema, gera roteiros bem-humorados com os personagens do universo Duolingo e produz páginas interativas completas e autossuficientes no projeto.

---

## 🎭 Personagens Oficiais Recorrentes
- 👦🏼 **Junior:** Curioso, esperto e sempre convence o pai com perguntas lógicas.
- 🧔🏻 **Eddy:** O pai atlético, ingênuo e bem-intencionado.
- 👵🏼 **Lucy:** A avó enérgica com um passado misterioso de viagens e espionagem.
- 👧🏻 **Lin:** A neta prática, sarcástica, artística e descolada.
- 👩🏽 **Bea:** A jovem profissional focada, trabalhadora e ambiciosa.
- 👨🏾 **Vikram:** O cozinheiro calmo, apaixonado por culinária e amigo paciente.
- 🎨 **Oscar:** O professor de arte dramático, sofisticado e perfeccionista.
- 👧🏽 **Zari:** A adolescente otimista, extrovertida e animada.

---

## 📋 Fluxo de Execução da Skill

### Passo 1: Diagnóstico e Seleção do Enredo
1. Cumprimentar o usuário no tom encorajador e amigável do mascote Duo 🦉.
2. Perguntar o idioma da história:
   - 🇺🇸 **Inglês (English)**
   - 🇪🇸 **Espanhol (Español)**
3. Perguntar o nível da história:
   - **Set 1 (A1 - Iniciante):** Frases curtas, vocabulário cotidiano essencial, presente.
   - **Set 2 (A2 - Elementar):** Situações cotidianas mais ricas, passado (*Past Simple / Pretérito*).
   - **Set 3 (B1 - Intermediário):** Diálogos com expressões idiomáticas, conectivos e chunks.
4. Sugerir 3 ideias de enredos cômicos com os personagens clássicos (ex: *"A Chave do Carro"*, *"Um Café Estranho"*, *"O Passaporte no Casaco"*).
5. Aguardar a escolha do usuário antes de gerar os arquivos.

---

### Passo 2: Regra Pedagógica de Idiomas
- **Idioma de Instrução (Metalinguagem / Base):** Sempre em **Português (PT-BR)**.
  - Títulos da história, enunciados das perguntas de compreensão (*"O que a Lucy esqueceu?"*, *"Por que o Junior está rindo?"*), balão de feedback (*"Excelente!"*, *"Quase lá!"*) e botões de ação (`CONTINUAR ➔`, `VERIFICAR`, `CONCLUIR HISTÓRIA ➔`).
- **Idioma Alvo (Diálogos, Prática & Áudio):** O idioma selecionado (🇺🇸 Inglês ou 🇪🇸 Espanhol).
  - Todas as falas dos personagens e áudios com `duoAudio.speak(line.text, 'en-US')` ou `duoAudio.speak(line.text, 'es-ES')`.

---

### Passo 3: Geração do Arquivo da História Interativa

Salvar o arquivo na pasta correspondente:
- **Inglês:** `stories/en/<slug>/index.html`
- **Espanhol:** `stories/es/<slug>/index.html`

#### Estrutura Técnica Padrão do Arquivo:
1. Importar folhas de estilo e scripts compartilhados:
   - `<link rel="stylesheet" href="../../../resources/duo-theme.css">`
   - `<script src="../../../resources/duo-sfx.js"></script>`
2. Header Duolingo autêntico:
   - Botão de fechar `[✕]` (`window.location.href='../../../index.html#stories'`).
   - Barra de progresso dinâmica (`.duo-progress-track` e `.duo-progress-fill`).
   - Indicadores de ofensiva (🔥) e gemas (💎).
3. Motor em JavaScript baseado no array linear de etapas `storySteps`:
   - `type: 'dialogue'`: Exibe o avatar do personagem, nome e o balão de fala no idioma de estudo.
     - Toca automaticamente `duoAudio.speak(line.text, lang)`.
     - Contém o grupo de ações com dois botões circulares:
       1. **Áudio (`🔊`):** Botão para reouvir a fala (`replayStoryAudio(text)` ou `playAudio(text)`).
       2. **Tradução (`🌐`):** Botão que alterna a exibição da tradução em português (`toggleStoryLineTranslation(idx)`).
     - A tradução fica inicialmente oculta (`display: none`) e surge abaixo do texto com animação suave ao ser clicada.
   - `type: 'question'`: Pausa a história com uma pergunta de compreensão contextual e 3 alternativas clicáveis (`.duo-choice-card`). Ao selecionar a correta, toca `duoAudio.playCorrect()` e avança.
   - `type: 'fill_blank'`: Frase pausada com lacuna e banco de palavras (`.duo-word-chip`) para completar a fala falada.
   - `type: 'match_pairs'`: Desafio final de fixação onde o aluno conecta 5 pares de termos-chave aprendidos na história com sua respectiva tradução em português.
4. Conclusão da História:
   - Efeito sonoro de vitória (`duoAudio.playSuccess()`), tela comemorativa com o mascote Duo, recompensa de **+25 XP** e **+5 Gemas**, e botão `CONCLUIR HISTÓRIA ➔`.

---

### Passo 4: Registro no Catálogo Central (`stories/stories-data.js`)
Ao criar uma nova história, registrar o metadado no objeto `window.STORIES_DATA` para exibição na galeria:
```javascript
{
  id: "story_slug",
  title: "Título da História em Português",
  originalTitle: "Original Title / Título Original",
  lang: "en", // ou "es"
  set: 1,
  level: "A1",
  icon: "🔑",
  characters: ["Junior", "Eddy"],
  path: "stories/en/story-slug/index.html",
  xp: 25
}
```
