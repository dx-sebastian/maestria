/**
 * data/diario.ts
 * Única fuente de contenido del sitio "Diario Lúdico".
 *
 * El texto reproduce fielmente el artículo original de Santiago Londoño.
 * No se resume ni se altera el sentido: solo se aplicó corrección
 * ortográfica y de puntuación menor para una lectura impecable.
 * Los componentes leen de aquí; no hay copys largos hardcodeados.
 */

export type DayId = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'

/** Un movimiento dentro de una jornada (cada clase / escena del día). */
export interface Movement {
  /** Encabezado del movimiento, ej. "Filosofía · Grado décimo" */
  title: string
  /** Espacio o grupo simbólico, ej. "El aula en movimiento" */
  scene: string
  /** Párrafos del cuerpo, fieles al original */
  paragraphs: string[]
}

export interface DiaryDay {
  id: DayId
  /** Día de la semana, ej. "Lunes" */
  label: string
  /** Número de jornada 1..5 */
  index: number
  /** Concepto eje del día (una palabra) */
  theme: string
  /** Descriptor temático ampliado */
  themeFull: string
  /** Frase-puente del narrador (editorial) que abre la jornada como capítulo */
  narration: string
  /** Epígrafe: una cita real y poderosa de la jornada */
  epigraph: string
  /** Token CSS de color acento para la identidad visual del día */
  accent: string
  /** Segundo token acento (motivo) */
  accentSoft: string
  /** Imagen principal de la jornada */
  image: string
  imageAlt: string
  /** Filtro CSS opcional para tratar la imagen (p. ej. suavizar artefactos) */
  imageFilter?: string
  /** Estación simbólica en la ruta de la semana */
  station: string
  /** Coordenada [x, y] en el SVG de la ruta (0..100) */
  coord: [number, number]
  /** Movimientos del día (sus clases) */
  movements: Movement[]
  /** Cita destacada (real, distinta del epígrafe) */
  pullQuote: string
  /** Frase de cierre reflexiva de la jornada (real) */
  close: string
  /** Conceptos / términos índice presentes en la jornada */
  concepts: string[]
  /** Nota mental manuscrita real (solo el jueves la tiene) */
  note?: { label: string; text: string }
}

export const SITE = {
  title: 'Diario Lúdico',
  tagline: 'Habitar la escuela desde la lúdica',
  subtitle: 'Diario de campo pedagógico',
  standfirst:
    'Más que un diario de actividades, este texto es una invitación a mirar la escuela como un territorio profundamente humano.',
  author: 'Santiago Londoño',
  role: 'Docente de lengua castellana y filosofía',
  school: 'Institución Educativa Rodrigo Correa Palacio',
  city: 'Medellín',
  location: 'Institución Educativa Rodrigo Correa Palacio · Medellín',
  program: 'Maestría en Lúdica y Aprendizaje Experiencial',
  seminar: 'Seminario de la Maestría en Lúdica y Aprendizaje Experiencial',
  credit: 'Diario de campo · Seminario de la Maestría en Lúdica y Aprendizaje Experiencial',
  meta: 'Cinco jornadas · Una semana de campo',
} as const

export const PRESENTATION = {
  kicker: 'Presentación',
  title: 'Vivo entre dos mundos que dialogan constantemente.',
  paragraphs: [
    'Mi nombre es Santiago Londoño. Soy docente de lengua castellana y filosofía en la Institución Educativa Rodrigo Correa Palacio, en la ciudad de Medellín. Vivo entre dos mundos que dialogan constantemente: el de la escuela y el de la lectura; el de la reflexión académica y el de las experiencias cotidianas que surgen en el encuentro con los estudiantes.',
    'Desde hace varios años he encontrado en la educación una forma de comprender la realidad y de construir sentido. Mi interés por la literatura, la filosofía y la lectura crítica nace de la convicción de que las palabras no solo describen el mundo, sino que también pueden transformarlo. Por ello, gran parte de mi trabajo consiste en acompañar a los estudiantes en la búsqueda de preguntas más que en la entrega de respuestas definitivas.',
    'Fuera del aula disfruto de la lectura, la música y los espacios de contemplación. Sin embargo, como ocurre con muchos maestros, las exigencias laborales y académicas suelen ocupar gran parte de mi tiempo. Precisamente por ello, este ejercicio de escritura se convirtió en una oportunidad para detenerme y observar cómo la lúdica aparece en mi vida cotidiana y en mi práctica docente.',
    'Durante una semana registré experiencias vividas en la escuela, un escenario atravesado por desafíos sociales complejos, pero también por la creatividad, la imaginación, el humor, la esperanza y el deseo de aprender. A través de estas páginas intento comprender de qué manera el juego, el arte, la conversación, el movimiento, la reflexión y la creación colectiva continúan habitando los espacios educativos, incluso en medio de las dificultades.',
    'Más que un diario de actividades, este texto es una invitación a mirar la escuela como un territorio profundamente humano, donde la lúdica no aparece únicamente en los momentos de diversión, sino también en la posibilidad de crear, imaginar, dialogar y construir sentidos compartidos. En estas experiencias encontré una oportunidad para reflexionar sobre mi oficio como maestro y sobre la necesidad de preservar la alegría, la creatividad y la esperanza en tiempos que parecen exigirnos únicamente productividad y resultados.',
  ],
} as const

/** Narrador del 'libro de cuentos': hilos editoriales que enmarcan la lectura. */
export const STORYBOOK = {
  opening: {
    kicker: 'Abre el diario',
    chapter: 'Preludio',
    narration:
      'Este es el diario de una semana en la Institución Educativa Rodrigo Correa Palacio, en Medellín. Ábrelo despacio: la lúdica es el hilo invisible que cose cada jornada.',
    cue: 'Desliza para abrir el libro',
  },
  toReflection:
    'Cuando sonó la última campana, no quedó una lección, sino una certeza.',
} as const

export const DIARY: DiaryDay[] = [
  {
    id: 'lunes',
    label: 'Lunes',
    index: 1,
    theme: 'Creación',
    themeFull: 'Movimiento, oralidad e imaginación colectiva',
    narration:
      'Al principio fue el movimiento: las ideas se levantaron de las sillas y echaron a andar por el aula.',
    epigraph:
      'La imaginación colectiva transformó el aula en un espacio distinto, donde la literatura dejó de ser un contenido escolar para convertirse en una experiencia viva.',
    accent: 'var(--ochre)',
    accentSoft: 'var(--amber)',
    image: '/images/lunes-creatividad.png',
    imageAlt:
      'Aula iluminada por la mañana con hojas de papel flotando, cuadernos abiertos y mariposas amarillas junto a la ventana.',
    station: 'El aula en movimiento',
    coord: [12, 70],
    movements: [
      {
        title: 'Filosofía · Grado décimo',
        scene: 'La idea del amor',
        paragraphs: [
          'Inicié la semana con las clases de filosofía en grado décimo. Trabajar con este grupo siempre representa un desafío. Muchos de los estudiantes conviven diariamente con contextos marcados por la violencia, el consumo de sustancias y situaciones de pobreza que inevitablemente afectan su disposición para el aprendizaje. En ellos la concentración no surge de manera espontánea; debe ser construida a través de experiencias que involucren el cuerpo, la participación y la creación.',
          'Durante la clase abordamos la teoría de las ideas de Platón, particularmente la idea del amor. Para acercar el tema a sus experiencias, realizamos una actividad en la que los estudiantes debían desplazarse por el aula y ubicarse en diferentes espacios según diversas representaciones del amor que aparecen en canciones, películas, redes sociales, creencias familiares y experiencias personales. Posteriormente discutimos cuáles de esas representaciones correspondían a apariencias o imágenes construidas culturalmente y cuáles podían acercarse a una idea más profunda del amor. El movimiento, la conversación y la posibilidad de expresar opiniones generaron una participación mucho mayor de la que se puede producir en una explicación tradicional.',
          'Mientras observaba la actividad comprendí que la lúdica no solo se trata de jugar (como solía confundirlo); también aparece cuando el conocimiento deja de ser una información distante y se convierte en una experiencia que involucra el cuerpo, la imaginación y el diálogo. Durante algunos momentos pude ver estudiantes sonriendo, argumentando y escuchando a otros, algo que en ocasiones resulta difícil debido a las condiciones de su contexto.',
        ],
      },
      {
        title: 'Lengua castellana · Grados séptimo y octavo',
        scene: 'Oralidad y leyenda',
        paragraphs: [
          'Más tarde trabajé con los grupos de séptimo y octavo en el área de lengua castellana. Son estudiantes que atraviesan la transición entre la infancia y la adolescencia, una etapa marcada por la necesidad de afirmarse frente a los demás y por cierta resistencia a participar en actividades académicas. El tema central fue la oralidad y las creencias familiares relacionadas con mitos, leyendas y experiencias sobrenaturales.',
          'La conversación comenzó de manera tímida, pero poco a poco surgieron relatos sobre espantos, apariciones, brujas, duendes y otras historias escuchadas en sus hogares. Lo que inició como una actividad de clase terminó convirtiéndose en una construcción colectiva. Entre todos creamos una historia de terror inspirada en leyendas colombianas, aportando personajes, escenarios y acontecimientos inesperados.',
          'En esta experiencia encontré una de las expresiones más claras de la lúdica, es decir, la creación compartida. Los estudiantes reían, discutían posibilidades narrativas y esperaban con entusiasmo el turno para agregar un nuevo elemento a la historia. La imaginación colectiva transformó el aula en un espacio distinto, donde la literatura dejó de ser un contenido escolar para convertirse en una experiencia viva.',
        ],
      },
    ],
    pullQuote:
      'La lúdica no solo se trata de jugar; también aparece cuando el conocimiento deja de ser una información distante y se convierte en una experiencia que involucra el cuerpo, la imaginación y el diálogo.',
    close:
      'Al finalizar la jornada sentí satisfacción y alegría. Descubrí que muchos de los momentos más significativos de mi trabajo aparecen cuando el aprendizaje se encuentra con la creatividad.',
    concepts: ['Platón', 'la idea del amor', 'oralidad', 'mitos y leyendas', 'creación colectiva'],
  },
  {
    id: 'martes',
    label: 'Martes',
    index: 2,
    theme: 'Diálogo',
    themeFull: 'Argumentación, paz y el movimiento de las ideas',
    narration:
      'Después llegaron las palabras y aprendieron a discutir sin herirse, a moverse sin cuerpo.',
    epigraph:
      'Aunque no hubo movimiento físico, sí percibí una forma distinta de movimiento: el movimiento de las ideas.',
    accent: 'var(--slate)',
    accentSoft: 'var(--slate-soft)',
    image: '/images/martes-dialogo.png',
    imageAlt:
      'Aula en penumbra azulada con palabras luminosas suspendidas sobre el pizarrón y siluetas de estudiantes conversando.',
    imageFilter: 'blur(7px) saturate(0.9)',
    station: 'El movimiento de las ideas',
    coord: [33, 40],
    movements: [
      {
        title: 'Lectura crítica · Grados once (11.1 y 11.2)',
        scene: 'Argumentación y falacias',
        paragraphs: [
          'La jornada de hoy fue menos agitada que la del día anterior. Tuve clase de lectura crítica con los grupos 11.1 y 11.2, estudiantes que se encuentran en una etapa distinta de desarrollo personal y académico. En ellos es más evidente la preocupación por el futuro, las preguntas sobre el proyecto de vida y la necesidad de comprender el mundo que están próximos a habitar como ciudadanos adultos.',
          'Durante la clase trabajamos el tema de la argumentación y las falacias. Más que limitarnos a revisar conceptos teóricos, decidimos relacionarlos con la realidad política del país. Analizamos ejemplos de discursos públicos, identificamos argumentos sólidos y argumentos falaces, y reflexionamos sobre la manera en que muchas veces las emociones, los prejuicios o las generalizaciones sustituyen la construcción razonada de las ideas.',
          'La actividad central consistió en un debate sobre la construcción de la paz. Algunas voces defendían la necesidad de la fuerza militar como mecanismo para alcanzarla, mientras otras sostenían que la paz solo puede construirse a través de la ética, la convivencia y la transformación cultural. Las intervenciones fueron apasionadas y, en algunos momentos, las diferencias parecían difíciles de conciliar. Sin embargo, poco a poco el diálogo permitió que cada postura encontrara un espacio de escucha.',
          'Aunque no hubo movimiento físico como en otras experiencias pedagógicas, sí percibí una forma distinta de movimiento: el movimiento de las ideas. Las palabras circularon por el aula, las opiniones se confrontaron, los argumentos se fortalecieron y algunos estudiantes modificaron parcialmente sus posiciones al escuchar las razones de los demás. Comprendí que la lúdica también puede habitar estos espacios de exploración intelectual, cuando el pensamiento se convierte en una experiencia dinámica y colectiva.',
          'Al finalizar la discusión llegamos a una conclusión compartida: la construcción de una sociedad más pacífica requiere una formación ética sólida en toda la ciudadanía. Más allá de las diferencias políticas, coincidimos en que el respeto, la capacidad de escuchar y la argumentación responsable son herramientas fundamentales para prevenir los conflictos.',
          'Esta experiencia me permitió reflexionar sobre la importancia del diálogo. Ver a los estudiantes debatir, disentir y buscar puntos de encuentro me recordó que la educación sigue siendo uno de los escenarios privilegiados para aprender a convivir con la diferencia. Creo que esa es una de las misiones fundamentales para construir sociedad.',
        ],
      },
    ],
    pullQuote:
      'Comprendí que la lúdica también puede habitar estos espacios de exploración intelectual, cuando el pensamiento se convierte en una experiencia dinámica y colectiva.',
    close:
      'A pesar de que hoy la lúdica apareció menos en el cuerpo y más en el pensamiento, creo en la posibilidad de jugar con las ideas, cuestionarlas y reconstruirlas junto a otros; esa es otra forma de la lúdica.',
    concepts: ['argumentación', 'falacias', 'la construcción de la paz', 'ética', 'pensamiento crítico'],
  },
  {
    id: 'miercoles',
    label: 'Miércoles',
    index: 3,
    theme: 'Convivencia',
    themeFull: 'Conflicto, travesía literaria y colaboración',
    narration:
      'Hubo una mañana de ruido y otra de versos escondidos; entre las dos, la escuela aprendió a cuidarse.',
    epigraph:
      'Los pasillos, los corredores y las zonas comunes dejaron de ser simples lugares de tránsito para convertirse en escenarios de exploración.',
    accent: 'var(--moss)',
    accentSoft: 'var(--moss-soft)',
    image: '/images/miercoles-convivencia.png',
    imageAlt:
      'Pasillo escolar con fragmentos de poemas y mapas pegados en las paredes y siluetas de estudiantes leyendo en la penumbra dorada.',
    station: 'La travesía de los versos',
    coord: [50, 66],
    movements: [
      {
        title: 'Convivencia · Grado séptimo',
        scene: 'De la pelea al diálogo',
        paragraphs: [
          'La jornada comenzó de una manera inesperada, envuelta en gritos y algarabía; al llegar al colegio tuve que intervenir en una pelea entre dos estudiantes. La discusión, originada por un conflicto afectivo, atrajo rápidamente la atención de gran parte de la comunidad estudiantil. Algunos observaban la situación con emoción, como si asistieran a un espectáculo; otros la rechazaban y manifestaban preocupación por lo ocurrido. Más allá del incidente puntual, me llamó la atención la facilidad con la que la violencia logra convocar miradas y despertar interés.',
          'Lo sucedido se convirtió en una oportunidad para reflexionar con los estudiantes de grado séptimo sobre la convivencia. Conversamos acerca de las consecuencias de la violencia y sobre las formas en que muchas conductas que observamos en nuestros contextos familiares y sociales terminan reproduciéndose en la escuela. Algunos estudiantes compartieron experiencias similares vividas en sus hogares o en sus barrios, lo que permitió ampliar la discusión más allá del conflicto ocurrido esa mañana.',
          'La reflexión giró en torno a la importancia del amor propio, la dignidad y la capacidad de resolver las diferencias mediante la palabra. Aunque el tema surgió de una situación conflictiva, percibí que el diálogo abrió un espacio de escucha y reconocimiento mutuo. Comprendí que la lúdica no necesariamente se manifiesta en la alegría o en el juego visible (ayer lo intuí); también puede aparecer en aquellos momentos en que la conversación permite transformar una experiencia negativa en una oportunidad de aprendizaje y crecimiento colectivo.',
        ],
      },
      {
        title: 'Lectura crítica · Modelos flexibles (S1 y S2)',
        scene: 'El recorrido literario',
        paragraphs: [
          'Más tarde trabajé con los grupos S1 y S2, conformados por estudiantes de modelos flexibles que cursan dos grados en uno (6-7 y 8-9). Muchos de ellos han experimentado dificultades en sus trayectorias escolares y suelen mostrar resistencia frente a las dinámicas tradicionales del aula. Con ellos resulta especialmente importante incorporar actividades que impliquen movimiento, participación activa y trabajo colaborativo.',
          'Para la clase de lectura crítica realizamos un recorrido literario por diferentes espacios del colegio. Los estudiantes se organizaron en equipos y recibieron una serie de pistas que exigían razonamiento lógico, observación y comprensión lectora. Cada pista los conducía a un fragmento de poema escondido en distintos lugares de la institución. El reto consistía en reunir todos los fragmentos, reconstruir el texto completo y finalmente recitarlo ante sus compañeros.',
          'La actividad transformó temporalmente los espacios cotidianos del colegio. Los pasillos, los corredores y las zonas comunes dejaron de ser simples lugares de tránsito para convertirse en escenarios de exploración. Observé estudiantes corriendo, leyendo atentamente, discutiendo posibles respuestas y celebrando cada hallazgo. La búsqueda despertó entusiasmo y generó un ambiente diferente al de una clase convencional. Sin embargo, también apareció un elemento que me hizo reflexionar y cuestionarme, pues la competitividad afloró en muchos estudiantes. Algunos grupos estaban más interesados en ganar que en disfrutar el proceso. Aun así, la actividad demostró que ningún equipo podía avanzar sin la colaboración de todos sus integrantes. La necesidad de escuchar, coordinar esfuerzos y construir respuestas colectivas terminó siendo tan importante como el resultado final.',
        ],
      },
    ],
    pullQuote:
      'El juego puede convertirse en una herramienta para resignificar la experiencia escolar: lo que pudo ser una clase más terminó convirtiéndose en una aventura compartida.',
    close:
      'Hoy confirmé una idea presente en las lecturas del módulo: la lúdica fortalece el vínculo, la comunicación y la esperanza, porque permite que el aprendizaje ocurra desde la participación activa, el encuentro con los otros y la experiencia directa.',
    concepts: ['convivencia', 'amor propio y dignidad', 'recorrido literario', 'poesía', 'colaboración'],
  },
  {
    id: 'jueves',
    label: 'Jueves',
    index: 4,
    theme: 'Asombro',
    themeFull: 'Realismo mágico, inferencia y pensamiento crítico',
    narration:
      'Y una tarde, entre las páginas de un libro abierto, comenzaron a volar las mariposas amarillas.',
    epigraph:
      'Cuando los estudiantes participan activamente, el conocimiento deja de ser una obligación y comienza a sentirse como un descubrimiento.',
    accent: 'var(--jade)',
    accentSoft: 'var(--butterfly)',
    image: '/images/jueves-imaginacion.png',
    imageAlt:
      'Libro abierto sobre un pupitre del que emerge un pueblo en miniatura, rodeado de plantas y mariposas amarillas que invaden el aula: realismo mágico.',
    station: 'Las mariposas amarillas',
    coord: [72, 42],
    movements: [
      {
        title: 'Lengua castellana · Grado noveno',
        scene: 'Cien años de soledad',
        paragraphs: [
          'La jornada comenzó con los estudiantes de grado noveno en la clase de lengua castellana. Actualmente estamos explorando la literatura latinoamericana y decidimos acercarnos a ella a través de la lectura colectiva de Cien años de soledad, de Gabriel García Márquez. La dinámica consistió en leer el texto en voz alta de manera compartida, avanzando fragmento por fragmento entre todos los estudiantes.',
          'A medida que avanzaba la lectura, fuimos identificando algunos rasgos característicos de la identidad latinoamericana presentes en la obra: las desigualdades sociales, la violencia, las tensiones políticas, las tradiciones familiares y las diversas formas de resistencia que los pueblos han construido a través de la cultura, el arte y la literatura. Más que una actividad de comprensión textual, la lectura se convirtió en una conversación sobre nuestra propia historia y sobre las huellas que aún permanecen en nuestras sociedades.',
          'El ejercicio tenía además un propósito práctico: fortalecer la lectura en voz alta, la oralidad y la capacidad de hablar frente a otros. Algunos estudiantes leyeron con seguridad; otros mostraron timidez o nerviosismo. Sin embargo, poco a poco el grupo fue construyendo confianza. Descubrí que la lectura compartida también tiene una dimensión lúdica, pues convierte la palabra escrita en una experiencia colectiva donde cada voz aporta algo diferente a la construcción del significado.',
        ],
      },
      {
        title: 'Lectura crítica · Grados décimo (10.1 y 10.2)',
        scene: 'El juego del impostor',
        paragraphs: [
          'Más tarde trabajé con los grupos 10.1 y 10.2 en la clase de lectura crítica. Son grupos que presentan dificultades para mantener la atención durante largos periodos de tiempo, por lo que procuré diseñar una secuencia de actividades variadas que permitiera alternar momentos de explicación, observación y participación activa.',
          'Iniciamos con una aproximación teórica a la lectura inferencial, reflexionando sobre la diferencia entre lo que un texto dice explícitamente y aquello que puede deducirse a partir de pistas, relaciones y contextos. Posteriormente observamos un video con temática detectivesca en el que debíamos analizar diferentes indicios para descubrir al responsable de un crimen. Los estudiantes disfrutaron especialmente esta parte porque les permitió asumir el papel de investigadores, formular hipótesis y defender sus conclusiones a partir de evidencias.',
          'La actividad final fue un juego llamado «El impostor». Cada participante debía hablar sobre una categoría determinada —animales, países, deportes u otros temas—, pero uno de los integrantes recibía información diferente y debía intentar ocultar su condición utilizando respuestas ambiguas o suficientemente generales para no ser descubierto. Mientras tanto, los demás estudiantes debían escuchar con atención, analizar las respuestas y encontrar inconsistencias que permitieran identificar al impostor.',
          'Durante el desarrollo del juego observé cómo la lectura crítica trascendía los textos escritos y se convertía en una herramienta para interpretar situaciones de la vida cotidiana. Los estudiantes comprendieron que inferir también consiste en analizar información, interpretar señales, escuchar cuidadosamente y construir conclusiones razonadas.',
        ],
      },
    ],
    pullQuote:
      'Aprender no implica necesariamente permanecer inmóvil o recibir información de manera pasiva. La imaginación, la interpretación, el diálogo y el juego pueden convertir el aprendizaje en una experiencia más significativa.',
    close:
      'Al finalizar la jornada pensé que la lúdica posee una enorme capacidad para acercar a los estudiantes al conocimiento. Hoy confirmé que cuando los estudiantes participan activamente, el conocimiento deja de ser una obligación y comienza a sentirse como un descubrimiento.',
    concepts: ['Cien años de soledad', 'realismo mágico', 'lectura inferencial', 'El impostor', 'asombro'],
    note: {
      label: 'Nota mental',
      text: 'Debo cultivar la capacidad de asombro en mis estudiantes. Recuerdo a Freire cuando decía que los sentidos también se educan; cabe preguntarse entonces: ¿qué asombra a un adolescente? ¿Qué tipo de personas admiran y por qué? ¿Cómo lograr que las clases que imparto se conviertan en un pequeño Aleph que les permita ver la realidad para querer transformarla?',
    },
  },
  {
    id: 'viernes',
    label: 'Viernes',
    index: 5,
    theme: 'Sentido',
    themeFull: 'Mediación, pueblos imaginarios e introspección',
    narration:
      'Al final de la semana quedó el silencio, y en el silencio, la antigua pregunta por la luz.',
    epigraph:
      'Enseñar es caminar al lado de quienes buscan sentido, sin ser luz, solo acompañarlos en la incertidumbre.',
    accent: 'var(--dusk)',
    accentSoft: 'var(--amber)',
    image: '/images/viernes-esperanza.png',
    imageAlt:
      'Aula vacía al atardecer con luz dorada entrando por la ventana, pupitres en silencio y un cuaderno abierto sobre la mesa.',
    station: 'De las sombras a la luz',
    coord: [88, 72],
    movements: [
      {
        title: 'Lengua castellana · Grado séptimo',
        scene: 'La mesa de diálogo',
        paragraphs: [
          'La última jornada de la semana comenzó de manera caótica. Tenía programada una clase de lengua castellana con grado séptimo centrada en la gramática y las normas ortográficas, pero los acontecimientos del día obligaron a replantear completamente la planeación. Los estudiantes llegaron alterados debido a una discusión originada por un partido de fútbol en el que habían participado varios integrantes del grupo, tanto niños como niñas. Las tensiones eran evidentes desde el inicio de la clase y rápidamente asumí que ninguna actividad académica tendría sentido mientras el conflicto permaneciera sin resolverse.',
          'Decidí apoyarme en la figura del mediador escolar, un estudiante del mismo grupo, y organizamos una mesa de diálogo. El propósito era sencillo pero difícil de alcanzar: escuchar ambas partes, comprender lo sucedido y buscar soluciones que permitieran restaurar la convivencia. Al comienzo predominó la ira. Las palabras surgían cargadas de acusaciones, reproches y emociones intensas. Por momentos sentí que la situación podía escalar nuevamente hacia la confrontación.',
          'Sin embargo, poco a poco el diálogo comenzó a abrir espacio donde antes solo había tensión. Escuchar al otro permitió reconocer perspectivas diferentes y comprender que detrás del conflicto existían malentendidos, emociones heridas y dificultades para gestionar las diferencias. Finalmente logramos construir algunos acuerdos; las partes involucradas se ofrecieron disculpas mutuas y asumieron el compromiso de contribuir a un ambiente más respetuoso dentro del grupo.',
          'Cuando intenté retomar la clase que había preparado, sonó el timbre anunciando el final de la hora. Aunque no desarrollé el contenido planeado, terminé la jornada convencido de que la experiencia había sido profundamente significativa. Normalmente en mis clases la lúdica no aparece en forma de juego ni de actividad creativa; siento que más bien surge en la posibilidad de construir comunidad a través de la palabra (eso logré entender después de leer el texto de la profesora Yolanda y el maestro Klauss). Comprendí que educar también implica generar escenarios donde las personas puedan encontrarse y reconstruir los vínculos que la violencia amenaza con romper.',
        ],
      },
      {
        title: 'Lengua castellana · Grado noveno',
        scene: 'Pueblos imaginarios',
        paragraphs: [
          'Posteriormente tuve clase con grado noveno. Después de la intensidad emocional de la mañana, la imaginación ocupó el centro de la experiencia. Continuando el trabajo sobre literatura latinoamericana y luego de la lectura del primer capítulo de Cien años de soledad, propuse la creación de pueblos imaginarios inspirados en las características del realismo mágico.',
          'Cada estudiante debía diseñar un territorio ficticio donde convivieran elementos de la realidad colombiana, la fantasía, la crítica social y la imaginación. El aula se llenó de dibujos, colores, relatos y personajes extraordinarios. Algunos crearon pueblos donde llovían mariposas, otros imaginaron comunidades gobernadas por animales sabios o territorios donde los recuerdos podían materializarse en objetos visibles.',
          'La actividad fue recibida con entusiasmo porque permitía combinar distintas formas de expresión. Dibujar, narrar, imaginar y crear se convirtieron en herramientas para pensar la realidad desde perspectivas diferentes. Observé cómo los estudiantes utilizaban la fantasía no para escapar del mundo, sino para comprenderlo mejor y proponer alternativas frente a las dificultades de sus contextos. Allí encontré una de las manifestaciones más claras de la lúdica descrita en las lecturas: la creatividad como posibilidad de transformar la experiencia humana.',
        ],
      },
      {
        title: 'Filosofía · Grado décimo',
        scene: 'De las sombras a la luz',
        paragraphs: [
          'La jornada concluyó con la clase de filosofía en grado décimo. Realizamos una actividad titulada «De las sombras a la luz», inspirada en el mito de la caverna de Platón. El ejercicio invitaba a los estudiantes a identificar las sombras presentes en sus vidas —prejuicios, creencias sin fundamento, apariencias o limitaciones personales—, reflexionar sobre la luz que deseaban alcanzar y pensar los caminos que podrían recorrer para acercarse a ella.',
          'A diferencia de otras actividades realizadas durante la semana, esta transcurrió en silencio. El aula se convirtió en un espacio de introspección donde cada estudiante dialogaba consigo mismo. Observé rostros concentrados, miradas perdidas en la reflexión y largas pausas dedicadas a pensar el futuro.',
          'Muchos estudiantes se acercaron buscando respuestas definitivas. Querían saber cuál era el camino correcto o qué decisiones debían tomar para alcanzar sus metas. Sin embargo, comprendí que mi papel no consistía en responder esas preguntas. Mi tarea era acompañarlos en la búsqueda, ayudarlos a formular nuevas preguntas y ofrecer herramientas para que construyeran sus propias respuestas.',
        ],
      },
    ],
    pullQuote:
      'Observé cómo los estudiantes utilizaban la fantasía no para escapar del mundo, sino para comprenderlo mejor y proponer alternativas frente a las dificultades de sus contextos.',
    close:
      'Al finalizar el día pensé que quizás esa también es una forma de lúdica: la libertad de explorar el pensamiento, imaginar futuros posibles y aventurarse en la construcción de sentido. La semana terminó recordándome que enseñar es caminar al lado de quienes buscan sentido, sin ser luz, solo acompañarlos en la incertidumbre y confiar en que cada uno encontrará su propia manera de salir de la caverna.',
    concepts: ['mediación escolar', 'comunidad', 'pueblos imaginarios', 'mito de la caverna', 'introspección'],
  },
]

export const REFLECTION = {
  kicker: 'Reflexión final',
  title: 'La lúdica como resistencia',
  paragraphs: [
    'Escribir este diario me permitió descubrir algo que antes intuía, pero que no había observado con suficiente profundidad; incluso diría que invisibilizaba este aspecto en mi práctica docente: la lúdica está mucho más presente en mi vida cotidiana de lo que imaginaba. Sin embargo, también comprendí que solemos reducirla al juego visible, al movimiento corporal o a los momentos de diversión explícita, cuando en realidad, como plantean las lecturas del módulo, la lúdica es una dimensión humana mucho más amplia: una forma de habitar el mundo desde la creatividad, la libertad, el encuentro, el placer, la imaginación y la esperanza.',
    'Al iniciar este ejercicio pensaba que encontraría experiencias lúdicas principalmente en actividades recreativas o artísticas. No obstante, al releer cada día registrado descubrí que la lúdica aparecía incluso en escenarios atravesados por el conflicto, la incertidumbre y la tensión. Aparecía cuando un grupo de estudiantes debatía sobre la paz y se atrevía a escuchar argumentos contrarios a los propios; cuando una situación de violencia escolar se transformaba en una oportunidad para reflexionar sobre la dignidad humana; cuando un estudiante construía un pueblo imaginario inspirado en el realismo mágico; o cuando otro intentaba descubrir al impostor oculto entre las palabras ambiguas de sus compañeros.',
    'Las lecturas afirman que la lúdica no es solamente una acción, sino también una actitud y una vivencia que atraviesa la existencia humana. Esta idea transformó profundamente mi manera de comprender mi propia práctica docente. Durante años había asociado el juego con ciertas actividades específicas, pero ahora entiendo que la actitud lúdica aparece cuando existe disposición para el asombro, la creación y la búsqueda compartida de sentido. No siempre hubo risas durante la semana; en algunos momentos hubo silencio, preocupación o incluso conflicto. Sin embargo, también allí encontré experiencias lúdicas porque existía la posibilidad de construir algo nuevo a partir de la experiencia vivida.',
    'Uno de los hallazgos más significativos fue reconocer que la escuela puede y debería convertirse en un territorio lúdico. Las lecturas señalan que históricamente la escuela ha sido percibida como un espacio donde el juego y la creatividad son limitados por las exigencias de la disciplina, el rendimiento y la productividad. Sin embargo, durante esta semana observé cómo un aula puede transformarse en un escenario de exploración cuando los estudiantes recorren el colegio buscando fragmentos de poemas, cuando reconstruyen colectivamente una historia de terror o cuando convierten una discusión filosófica en una búsqueda personal sobre el sentido de la vida. Al mismo tiempo, este ejercicio me permitió cuestionar críticamente una realidad que atraviesa tanto la escuela como la sociedad. Vivimos en una cultura que privilegia la productividad por encima del disfrute. Constantemente se nos exige producir, responder, avanzar y cumplir. Como docente, muchas veces siento que el tiempo se encuentra ocupado por responsabilidades laborales y académicas que terminan desplazando espacios fundamentales para la lectura por placer, la creación musical, el ocio y el descanso (actividades que disfruto y que con este ejercicio comprendí que he dejado de lado por cumplir con lo laboral).',
    'También descubrí que la alegría posee una dimensión profundamente política. Los contextos en los que trabajo están atravesados por problemáticas complejas como la violencia, la pobreza, los conflictos familiares y la desesperanza. Sin embargo, aparecen la imaginación, la risa, el juego y la creación: cuando un estudiante imagina un mundo distinto, cuando participa en una actividad colectiva o cuando se atreve a formular preguntas sobre su futuro, está realizando un acto de resistencia frente a las condiciones que intentan limitar sus posibilidades de existencia.',
    'Quizá el aprendizaje más importante de esta semana tiene relación con mi propia comprensión del oficio docente. Al observar las experiencias registradas comprendí que mi tarea no consiste únicamente en transmitir conocimientos. Mi labor se parece más a la construcción de escenarios donde el pensamiento, la creatividad y la esperanza puedan desplegarse, como si fuera una especie de curador que busca el equilibrio entre el conocimiento y las formas para posibilitarlo. Lo entendí especialmente durante la actividad inspirada en el mito de la caverna. Muchos estudiantes buscaban respuestas definitivas, pero descubrí que mi papel no es convertirme en la luz ni señalar el camino correcto. Mi responsabilidad consiste en acompañar la búsqueda, formular preguntas y ayudar a que cada estudiante construya sus propias formas de comprender el mundo.',
    'Al finalizar esta experiencia concluyo que la lúdica está presente cuando jugamos, pero también cuando imaginamos, dialogamos, creamos, reflexionamos, reímos o soñamos. Tal vez educar sea precisamente abrir pequeños espacios donde, a pesar de las dificultades, siga siendo posible jugar con las ideas, imaginar otros mundos y creer que la realidad puede transformarse.',
  ],
  /** Cierre-crescendo: la última línea del diario. */
  closing:
    'Como si la escuela fuera un submundo para la oportunidad, para imaginarse otras realidades donde la felicidad sea bandera y el aprender una consecuencia del asombro.',
  signature: 'Santiago Londoño',
} as const

export function getDay(id: DayId): DiaryDay {
  return DIARY.find((d) => d.id === id) ?? DIARY[0]
}
