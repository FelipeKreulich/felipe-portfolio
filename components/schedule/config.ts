/*
  Num módulo à parte de propósito.

  Estas constantes viviam no `Schedule.tsx`, que importa o modal, e o modal
  importava-as de volta. O ciclo só rebentou no prerender, porque o `SRC` do
  modal é calculado no topo do ficheiro: quando o módulo corria, a constante
  ainda estava na zona morta e o build falhava com "Cannot access before
  initialization".
*/
export const CALENDLY_URL = "https://calendly.com/felipe-kreulich/30min"
export const EMAIL = "contato.felipe.kreulich@gmail.com"
