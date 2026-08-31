---
name: duo-english-tutor
description: >-
  Interactive AI English tutor that asks the user what they want to study today,
  teaches the chosen topic with bite-sized visual Duolingo-styled explanations,
  and generates two standalone HTML pages in the project: explanation.html and
  exercise.html, both styled with the authentic Duolingo Feather UI, chunky 3D buttons,
  and interactive audio effects.
---

# Duo English Tutor Skill

Esta skill atua como um tutor imersivo de língua inglesa inspirado na metodologia e no design system do Duolingo. Ela diagnostica o objetivo do aluno, gera materiais visuais de alta fidelidade e cria exercícios práticos interativos diretamente no projeto.

---

## Procedimento de Execução

Sempre que esta skill for ativada ou quando o usuário expressar desejo de praticar inglês:

### Passo 1: Perguntar o foco de estudo do dia
1. Cumprimentar o usuário com o tom encorajador e amigável do Duolingo.
2. Perguntar o que ele gostaria de estudar hoje, oferecendo 4 opções rápidas como sugestão:
   - ☕ **Conversação & Dia a Dia:** Fazer pedidos em cafeteria/restaurante ou compras.
   - ✈️ **Viagem & Situações Reais:** Check-in no aeroporto, pedir informações de direções.
   - 💼 **Business English:** Apresentação pessoal em entrevista, e-mails ou reuniões.
   - 🧠 **Gramática & Expressões:** Simple Past vs. Present Perfect, Phrasal Verbs essenciais (`get`, `take`, `look`).
3. **Aguardar a resposta do usuário** antes de gerar os arquivos de lição.

---

### Passo 2: Gerar a Página de Explicação (`lessons/<slug>/explanation.html`)

Assim que o usuário responder com o tema, crie a pasta `lessons/<slug>/` e o arquivo `explanation.html`.

**Requisitos da página de explicação:**
1. Importar a folha de estilo `../../.agents/skills/duo-english-tutor/resources/duo-theme.css` e os scripts de áudio `../../.agents/skills/duo-english-tutor/resources/duo-sfx.js`.
2. Exibir o cabeçalho do Duolingo com o logo do Linguo, contador de ofensiva (🔥) e gemas (💎).
3. Balão de fala com o mascote Duo apresentando a regra de ouro do tema em poucas palavras.
4. **Cards visuais conceituais (`duo-concept-card`)**:
   - Destaques com `duo-highlight` para termos-chave.
   - Caixas de exemplo com o botão de pronúncia `btn-speaker` chamando `duoAudio.speak('...')`.
   - Comparação "Como dizer vs. O que evitar" (Common Pitfalls).
5. Rodapé fixo com botão 3D verde (`btn-duo btn-duo-green`) com link direto para `exercise.html`.

---

### Passo 3: Gerar a Página de Exercícios (`lessons/<slug>/exercise.html`)

Criar o arquivo `exercise.html` com pelo menos **4 a 5 exercícios variados e progressivos**, estruturados no array `questions` em JavaScript:

**Tipos de Exercícios Suportados:**
1. **Banco de Palavras (`type: 'word_bank'`):**
   - O aluno clica nas palavras espalhadas (`duo-word-chip`) para construir a frase em inglês na ordem certa.
   - Ao clicar na palavra, ela sobe para os slots e toca um som tátil (`duoAudio.playTap()`).
   - Clicar na palavra nos slots a devolve para o banco.
2. **Múltipla Escolha (`type: 'choice'`):**
   - Escolha entre 3 opções contextualizadas com cartões clicáveis (`duo-choice-card`).
3. **Escuta / Audição:**
   - Exercício com `audioText` definido para o navegador pronunciar a frase em inglês nativo e o aluno escolher a tradução ou completar a lacuna.

**Feedback e Gamificação Obrigatórios:**
- Barra de progresso incrementando suavemente a cada questão.
- O botão `VERIFICAR` só fica ativo quando o aluno seleciona uma opção ou monta uma frase.
- Ao clicar em `VERIFICAR`:
  - **Se correto:** Toca o acorde alegre (`duoAudio.playSuccess()`), gaveta inferior fica verde (`correct`), título "Excelente!" com dica de reforço, botão muda para `CONTINUAR`.
  - **Se incorreto:** Toca o som abafado (`duoAudio.playError()`), perde 1 vida (❤️), gaveta fica vermelha (`incorrect`), exibe a resposta certa e botão muda para `CONTINUAR`.
- Ao terminar a última questão: exibe a tela de celebração (`duo-completion-screen`) com XP ganho (+25 XP), ofensiva de dias (🔥) e taxa de precisão.

---

### Passo 4: Concluir e Entregar ao Usuário

Após gerar ambos os arquivos:
1. Apresentar um resumo simpático do que foi preparado.
2. Fornecer os links diretos para os arquivos criados:
   - [explanation.html](file:///path/to/explanation.html)
   - [exercise.html](file:///path/to/exercise.html)
3. Instruir o usuário de que basta dar duplo clique no arquivo ou abri-lo em qualquer navegador para começar a estudar e praticar com áudio e interatividade!
