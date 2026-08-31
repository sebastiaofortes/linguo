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
1. Importar a folha de estilo `../../resources/duo-theme.css` e os scripts de áudio `../../resources/duo-sfx.js`.
2. Exibir o cabeçalho do Duolingo com o logo do Linguo, contador de ofensiva (🔥) e gemas (💎).
3. Balão de fala com o mascote Duo apresentando a regra de ouro do tema em poucas palavras.
4. **Cards visuais conceituais (`duo-concept-card`)**:
   - Destaques com `duo-highlight` para termos-chave.
   - Caixas de exemplo com o botão de pronúncia `btn-speaker` chamando `duoAudio.speak('...')`.
   - Comparação "Como dizer vs. O que evitar" (Common Pitfalls).
5. Rodapé fixo com botão 3D verde (`btn-duo btn-duo-green`) com link direto para `exercise.html`.

---

### Passo 3: Gerar a Página de Exercícios (`lessons/<slug>/exercise.html`)

Criar o arquivo `exercise.html` com os exercícios estruturados no array `questions` em JavaScript:
- **Lições Regulares:** 5 exercícios progressivos e balanceados (+25 XP).
- **Lições Finais de Unidade (Desafios de Troféu 🏆):** Bateria de **50 exercícios de revisão geral** cobrindo todos os tópicos da unidade (+50 XP).

**Regra de Aleatorização (Shuffle Obrigatório em Lições Finais):**
Em lições de revisão ou desafios de unidade, a ordem das questões, opções e tokens do Word Bank DEVE ser embaralhada a cada execução usando o algoritmo Fisher-Yates para garantir fator replay e impedir memorização mecânica:
```javascript
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
// Embaralhar o array questions antes de renderizar
shuffleArray(questions);
```

**Tipos de Exercícios Suportados:**
1. **Banco de Palavras (`type: 'word_bank'`):**
   - O aluno clica nas palavras espalhadas (`duo-word-chip`) para construir a frase em inglês na ordem certa.
   - Ao clicar na palavra, ela sobe para os slots e toca um som tátil (`duoAudio.playTap()`).
   - Clicar na palavra nos slots a devolve para o banco.
2. **Múltipla Escolha (`type: 'choice'`):**
   - Escolha entre 3 opções contextualizadas com cartões clicáveis (`duo-choice-card`).
3. **Escuta / Audição:**
   - Exercício com `audioText` definido para o navegador pronunciar a frase em inglês nativo e o aluno escolher a tradução ou completar a lacuna.

**Regra de Explicação da Resposta (Modal '💡 Ver explicação da resposta'):**
Em desafios finais de unidade, cada pergunta deve conter um objeto `explanation` com:
- `topic`: Título resumido da regra (ex: *"Regra do -ES para He/She/It"*).
- `rule`: Explicação pedagógica clara e direta do porquê aquela resposta é a correta.
- `comparison`: Exemplo visual de contraste (*✅ Correto vs. ❌ Incorreto*).
- `audioPhrase`: Frase de áudio para pronúncia nativa no modal.
- `theoryUrl`: Link relativo para a lição de teoria completa (ex: `../present-simple-affirmative/explanation.html`).

No rodapé de feedback (`.duo-footer-drawer`), incluir o botão interativo `<button class="btn-explain-answer" onclick="openExplanationModal()">💡 Ver explicação da resposta</button>` e a gaveta modal deslizante `.duo-explanation-sheet` com suporte aos modos claro e escuro.

**Feedback e Gamificação Obrigatórios:**
- Barra de progresso incrementando suavemente a cada questão.
- O botão `VERIFICAR` só fica ativo quando o aluno seleciona uma opção ou monta uma frase.
- Ao clicar em `VERIFICAR`:
  - **Se correto:** Toca o acorde alegre (`duoAudio.playSuccess()`), gaveta inferior fica verde (`correct`), título "Excelente!" com dica de reforço, botão muda para `CONTINUAR`.
  - **Se incorreto:** Toca o som abafado (`duoAudio.playError()`), perde 1 vida (❤️), gaveta fica vermelha (`incorrect`), exibe a resposta certa e botão muda para `CONTINUAR`.
- Ao terminar a última questão: exibe a tela de celebração (`duo-completion-screen`) com XP ganho (+25 XP ou +50 XP em finais), ofensiva de dias (🔥) e taxa de precisão.

---

### Passo 4: Atualizar o Índice Geral (`index.html` e `lessons/lessons.json`)

**Obrigatório a cada nova aula criada:**
1. Adicionar a nova lição no arquivo `lessons/lessons.json` dentro da respectiva unidade (ou criando uma nova unidade temática se o tema pertencer a um novo módulo):
   - **Paletas de Cores Disponíveis:** `green` (Fundamentos), `blue` (Viagens & Aeroporto), `purple` (Rotina & Hobbies), `orange` (Business English), `teal` (Gramática & Phrasal Verbs), `rose` (Cultura).
   ```json
   {
     "units": [
       {
         "id": "unit-X",
         "number": X,
         "section": 1,
         "title": "<Nome da Unidade>",
         "description": "<Descrição curta>",
         "color": "green", // ou "blue", "purple", "orange", "teal", "rose"
         "badgeText": "TRILHA ATIVA",
         "lessons": [
           {
             "id": "<slug>",
             "title": "<Título da Aula>",
             "subtitle": "<Resumo>",
             "icon": "⭐",
             "theoryUrl": "lessons/<slug>/explanation.html",
             "exerciseUrl": "lessons/<slug>/exercise.html",
             "status": "active",
             "date": "AAAA-MM-DD"
           }
         ]
       }
     ]
   }
   ```
2. Sincronizar o objeto `UNITS_DATA` no arquivo `index.html` na raiz do projeto, para que cada unidade seja renderizada dinamicamente com seu banner colorido, subtítulo e os nós da sua trilha em zigue-zague com popovers interativos.

---

### Passo 5: Concluir e Entregar ao Usuário

Após gerar ambos os arquivos e atualizar o índice:
1. Apresentar um resumo simpático do que foi preparado.
2. Fornecer os links diretos e clicáveis:
   - 🏠 [index.html](file:///path/to/index.html) (Trilha Geral estilo Duolingo)
   - 📖 [explanation.html](file:///path/to/lessons/<slug>/explanation.html)
   - 🎯 [exercise.html](file:///path/to/lessons/<slug>/exercise.html)
3. Instruir o usuário de que basta dar duplo clique em `index.html` ou em qualquer lição no navegador para estudar e praticar com áudio e efeitos interativos!

