
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const element = $(id);
    if (element) element.textContent = value;
  };

  // MENU RESPONSIVO

  const nav = $("navlinks");
  const menu = $("menuBtn");

  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    });
  });

  // ACESSIBILIDADE

  $("contrastBtn").addEventListener("click", () => {
    const active = document.body.classList.toggle("high-contrast");
    $("contrastBtn").setAttribute("aria-pressed", String(active));
  });

  $("dyslexiaBtn").addEventListener("click", () => {
    const active = document.body.classList.toggle("dyslexia");
    $("dyslexiaBtn").setAttribute("aria-pressed", String(active));
  });

  // ESPECTRO ELETROMAGNÉTICO

  const spectrumData = {
    visivel: [
      "Luz visível",
      "É a faixa que nossos olhos detectam. Parte dela é absorvida por superfícies e convertida em energia térmica."
    ],
    infra: [
      "Infravermelho",
      "Está associado à emissão térmica dos objetos. A água e as superfícies da piscina trocam energia por radiação infravermelha."
    ],
    uv: [
      "Ultravioleta",
      "Tem frequência maior que a luz visível. A exposição excessiva pode causar danos; a radiação UV não é a principal responsável pelo aquecimento solar da piscina."
    ],
    micro: [
      "Micro-ondas",
      "É usada em comunicações e aquecimento em situações específicas, mas não é o mecanismo típico de aquecimento de uma piscina solar."
    ]
  };

  $("spectrumSelect").addEventListener("change", (event) => {
    const data = spectrumData[event.target.value];

    setText("spectrumTitle", data[0]);
    setText("spectrumText", data[1]);
  });

  // SIMULADOR DE CORPO NEGRO

  function updateTemp() {
    const temperature = Number($("tempSlider").value);

    setText("tempOut", temperature + " K");

    const glow = $("glow");
    const percentage = Math.max(
      0,
      Math.min(1, (temperature - 250) / 950)
    );

    const red = Math.round(210 + 45 * percentage);
    const green = Math.round(65 + 110 * percentage);
    const blue = Math.round(30 + 190 * percentage);

    glow.style.background = `rgb(${red}, ${green}, ${blue})`;

    glow.style.boxShadow =
      `0 0 ${15 + 45 * percentage}px ` +
      `rgba(${red}, ${green}, ${blue}, .7)`;

    if (temperature < 650) {
      setText(
        "tempMood",
        "Emissão principalmente infravermelha"
      );

      setText(
        "tempDesc",
        "A emissão térmica ocorre sobretudo no infravermelho, invisível aos olhos humanos."
      );
    } else if (temperature < 950) {
      setText("tempMood", "Emissão mais intensa");

      setText(
        "tempDesc",
        "Com a temperatura maior, a energia emitida aumenta e o espectro se desloca para comprimentos de onda menores."
      );
    } else {
      setText(
        "tempMood",
        "Mais emissão em comprimentos menores"
      );

      setText(
        "tempDesc",
        "O objeto ideal fica muito mais quente; o pico de emissão se desloca para comprimentos de onda menores."
      );
    }
  }

  $("tempSlider").addEventListener("input", updateTemp);
  updateTemp();

  // SIMULADOR DO EFEITO FOTOELÉTRICO

  function updatePhoto() {
    const frequency = Number($("freqSlider").value);
    const threshold = Number($("thresholdSelect").value);

    setText("freqOut", frequency);

    $("lightBeam").style.opacity = String(
      0.35 + 0.065 * frequency
    );

    $("lightBeam").style.height = (6 + frequency) + "px";

    const possible = frequency >= threshold;

    setText(
      "photoStatus",
      possible
        ? "Emissão possível"
        : "Frequência abaixo do limiar"
    );

    setText(
      "photoText",
      possible
        ? "Neste modelo, cada fóton tem energia suficiente para superar a função trabalho do material."
        : "Neste modelo, a energia de cada fóton é insuficiente para liberar elétrons, mesmo que a intensidade aumente."
    );

    setText(
      "electronGlyph",
      possible ? "e⁻  e⁻  e⁻" : "sem emissão"
    );
  }

  $("freqSlider").addEventListener("input", updatePhoto);

  $("thresholdSelect").addEventListener(
    "change",
    updatePhoto
  );

  updatePhoto();

  // SIMULADOR DE AQUECIMENTO DA PISCINA

  function updateHeat() {
    const sun = Number($("sunSlider").value);

    setText("sunOut", sun + "%");
    setText("heatOut", sun + " / 100");

    $("heatBar").style.width = sun + "%";

    setText(
      "coverText",
      $("coverSelect").value === "yes"
        ? "A capa ajuda a reduzir perdas de calor e evaporação quando a piscina não está em uso."
        : "Sem capa, a evaporação costuma aumentar e pode levar a maior perda de calor."
    );
  }

  $("sunSlider").addEventListener("input", updateHeat);

  $("coverSelect").addEventListener(
    "change",
    updateHeat
  );

  updateHeat();

  // PAINEL DE SENSORES

  function updateSensors() {
    const temperature = Number($("waterTemp").value);
    const luminosity = Number($("brightness").value);
    const level = $("waterLevel").value;

    setText("waterTempOut", temperature + " °C");
    setText("brightnessOut", luminosity + "%");

    let title = "Monitoramento normal";

    let advice =
      "Temperatura e luminosidade dentro das condições simuladas. O controlador continua monitorando.";

    let kind = "";

    if (level === "baixo") {
      title = "Alerta: nível baixo";

      advice =
        "Verificar o nível. Em um sistema real, seguir a lógica de segurança e impedir funcionamento a seco quando aplicável.";

      kind = "bad";
    } else if (level === "alto") {
      title = "Alerta: nível alto";

      advice =
        "Verificar abastecimento e drenagem conforme o projeto hidráulico.";

      kind = "warn";
    } else if (temperature < 25 && luminosity >= 50) {
      title = "Condição favorável ao aquecimento solar";

      advice =
        "A água está abaixo da meta ilustrativa e há luminosidade. O controlador pode avaliar a circulação pelo coletor.";
    } else if (temperature >= 25) {
      title = "Meta ilustrativa atingida";

      advice =
        "A temperatura chegou à meta de 25 °C deste exemplo. Evite aquecimento desnecessário e continue monitorando.";
    } else {
      title = "Aguardando melhores condições solares";

      advice =
        "A água está abaixo da meta e a luminosidade está baixa. O sistema pode aguardar e continuar monitorando.";

      kind = "warn";
    }

    setText("sensorStatus", title);
    setText("sensorAdvice", advice);

    $("statusDot").className = "dot" + (kind ? " " + kind : "");
  }

  ["waterTemp", "brightness", "waterLevel"].forEach((id) => {
    $(id).addEventListener("input", updateSensors);
  });

  $("waterLevel").addEventListener("change", updateSensors);

  updateSensors();

  // QUIZ INTERATIVO

  const questions = [
    {
      q: "Qual é a principal função de um coletor solar térmico?",
      a: [
        "Gerar ondas de rádio",
        "Transferir energia solar para aquecer a água",
        "Medir o nível da piscina"
      ],
      correct: 1,
      why: "O coletor absorve radiação e transfere energia térmica para a água."
    },
    {
      q: "O que a capa térmica ajuda a reduzir principalmente?",
      a: [
        "A frequência da luz solar",
        "A evaporação e a perda de calor",
        "A gravidade"
      ],
      correct: 1,
      why: "A capa reduz a evaporação e ajuda a conservar energia térmica."
    },
    {
      q: "Qual sensor ajuda a monitorar se a água está na temperatura desejada?",
      a: [
        "Sensor de temperatura",
        "Sensor de som apenas",
        "Sensor de cor"
      ],
      correct: 0,
      why: "O sensor de temperatura mede a água para apoiar decisões do controlador."
    }
  ];

  let questionIndex = 0;
  let score = 0;
  let answered = false;
  let quizComplete = false;

  function renderQuiz() {
    quizComplete = false;

    const question = questions[questionIndex];

    setText(
      "quizCount",
      `Pergunta ${questionIndex + 1} de ${questions.length}`
    );

    setText("quizQuestion", question.q);
    setText("quizFeedback", "");

    $("quizNext").disabled = true;

    $("quizNext").textContent =
      questionIndex === questions.length - 1
        ? "Ver resultado →"
        : "Próxima pergunta →";

    $("quizOptions").replaceChildren();

    answered = false;

    question.a.forEach((answer, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = answer;

      button.addEventListener("click", () => {
        chooseAnswer(index);
      });

      $("quizOptions").appendChild(button);
    });
  }

  function chooseAnswer(index) {
    if (answered) return;

    answered = true;

    const question = questions[questionIndex];

    const buttons = [
      ...$("quizOptions").querySelectorAll("button")
    ];

    buttons.forEach((button, buttonIndex) => {
      button.disabled = true;

      if (buttonIndex === question.correct) {
        button.classList.add("correct");
      }

      if (
        buttonIndex === index &&
        index !== question.correct
      ) {
        button.classList.add("incorrect");
      }
    });

    if (index === question.correct) {
      score++;

      setText(
        "quizFeedback",
        "Correto! " + question.why
      );
    } else {
      setText(
        "quizFeedback",
        "Quase! " + question.why
      );
    }

    $("quizNext").disabled = false;
  }

  $("quizNext").addEventListener("click", () => {
    if (quizComplete) {
      questionIndex = 0;
      score = 0;
      renderQuiz();
      return;
    }

    if (!answered) return;

    if (questionIndex < questions.length - 1) {
      questionIndex++;
      renderQuiz();
      return;
    }

    quizComplete = true;

    setText("quizCount", "Quiz concluído");

    setText(
      "quizQuestion",
      `Você acertou ${score} de ${questions.length} perguntas.`
    );

    $("quizOptions").replaceChildren();

    if (score === 3) {
      setText(
        "quizFeedback",
        "Excelente! Você dominou os conceitos deste quiz."
      );
    } else if (score === 2) {
      setText(
        "quizFeedback",
        "Muito bem! Revise os tópicos e tente novamente."
      );
    } else {
      setText(
        "quizFeedback",
        "Revise o resumo acima e tente novamente."
      );
    }

    $("quizNext").textContent = "Refazer quiz";
    $("quizNext").disabled = false;
  });

  renderQuiz();
})();
