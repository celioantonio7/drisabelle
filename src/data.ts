export const WHATSAPP_NUMBER = '5512996232567'
export const WHATSAPP_MESSAGE = 'Olá, Dra. Isabella! Gostaria de agendar uma avaliação.'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
export const INSTAGRAM_URL = 'https://www.instagram.com/isabellapferro/'
export const INSTAGRAM_POST_URL = 'https://www.instagram.com/p/DWXSzTTlou0/'

export const NAV = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'faq', label: 'FAQ' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'contato', label: 'Contato' },
] as const

export const FAQ = [
  {
    q: 'Como funciona a avaliação inicial?',
    a: 'A avaliação é um momento para entender os seus objetivos, analisar a saúde bucal e indicar o tratamento mais adequado. Utilizamos fotos, exames e, quando necessário, um planejamento digital do sorriso para que você visualize o resultado antes de iniciar o tratamento.',
  },
  {
    q: 'Qual a diferença entre lentes em resina e porcelana?',
    a: 'As lentes em resina e em porcelana têm indicações diferentes. Durante a avaliação, a Dra. Isabella analisa o seu caso e indica a opção mais adequada para o seu sorriso.',
  },
  {
    q: 'Os resultados ficam naturais?',
    a: 'O planejamento é feito de forma personalizada, respeitando a harmonia facial e a identidade de cada paciente, com foco em um resultado natural.',
  },
  {
    q: 'Quanto tempo dura o tratamento?',
    a: 'O tempo varia de acordo com cada caso. Ele é definido durante a avaliação, junto com o planejamento individualizado do seu tratamento.',
  },
  {
    q: 'Como posso agendar minha consulta?',
    a: 'Você pode agendar a sua avaliação diretamente pelo WhatsApp, clicando no botão "Solicitar Avaliação" ou no botão flutuante do site.',
  },
] as const
