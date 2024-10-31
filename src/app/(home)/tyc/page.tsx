import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Turismomza | TyC',
  description: '...',
};

export default function TyCPage() {
  return (
    <div className="flex flex-col flex-grow gap-4 p-8 md:p-12">
      <h2 className="font-bold text-3xl">Términos y condiciones</h2>
      <div className="flex flex-col gap-3">
        <div>
          <h4 className="font-bold">Introducción</h4>
          <p>
            Bienvenido a Turismomza. Al utilizar nuestro sitio web, aceptas
            cumplir con los siguientes términos y condiciones. Si no estás de
            acuerdo con alguna parte de estos términos, te rogamos que no
            utilices nuestro sitio web.
          </p>
        </div>

        <div>
          <h4 className="font-bold">Uso del Sitio Web</h4>
          <ol className="list-decimal ml-6">
            <li>
              <b>Propósito del Sitio Web:</b> Turismomza es una plataforma
              destinada a la creación y visualización de publicaciones sobre
              lugares turísticos de Mendoza. Nuestro objetivo es proporcionar
              una guía completa y accesible para que tanto visitantes como
              residentes descubran y disfruten de todo lo que Mendoza tiene para
              ofrecer.
            </li>
            <li>
              <b>Elegibilidad:</b> Para utilizar nuestro sitio web, debes ser
              mayor de edad según las leyes de tu país y tener la capacidad
              legal para aceptar estos términos.
            </li>
          </ol>
        </div>

        <div>
          <h4 className="font-bold">Contenido Generado por el Usuario</h4>
          <ol className="list-decimal ml-6">
            <li>
              <b>Publicaciones:</b> Los usuarios pueden crear y compartir
              publicaciones sobre lugares turísticos de Mendoza. Al hacerlo,
              garantizas que toda la información proporcionada es precisa y no
              infringe los derechos de terceros.
            </li>
            <li>
              <b>Responsabilidad del Usuario:</b> Turismomza no se hace
              responsable de la veracidad o exactitud de la información
              proporcionada por los usuarios. Cualquier contenido generado por
              los usuarios refleja únicamente las opiniones y experiencias de
              dichos usuarios y no de Turismomza.
            </li>
          </ol>
        </div>

        <div>
          <h4 className="font-bold">Limitación de Responsabilidad</h4>
          <ol className="list-decimal ml-6">
            <li>
              <b>Exclusión de Responsabilidad:</b> Turismomza no será
              responsable por ninguna pérdida o daño que surja del uso del sitio
              web, incluidos, pero no limitados a, daños directos, indirectos,
              incidentales, punitivos y consecuentes.
            </li>
            <li>
              <b>Estafas y Falsa Información:</b> No nos hacemos responsables
              por estafas, fraudes o cualquier otra actividad engañosa que pueda
              ocurrir debido a la información proporcionada por los usuarios en
              nuestro sitio web. Los usuarios deben realizar sus propias
              investigaciones y tomar precauciones al interactuar con otros
              usuarios o utilizar la información disponible en el sitio.
            </li>
          </ol>
        </div>

        <div>
          <h4 className="font-bold">Propiedad Intelectual</h4>
          <ol className="list-decimal ml-6">
            <li>
              <b>Derechos de Autor:</b> Todo el contenido del sitio web,
              incluyendo texto, gráficos, logotipos, íconos, imágenes y
              software, es propiedad de Turismomza o de sus proveedores de
              contenido y está protegido por las leyes de derechos de autor
              internacionales.
            </li>
            <li>
              <b>Licencia Limitada:</b> Turismomza te otorga una licencia
              limitada para acceder y hacer uso personal del sitio web. Esta
              licencia no incluye la reventa o el uso comercial del sitio web o
              su contenido.
            </li>
          </ol>
        </div>

        <div>
          <h4 className="font-bold">Modificaciones de los Términos</h4>
          <p>
            Nos reservamos el derecho de modificar estos términos y condiciones
            en cualquier momento. Las modificaciones entrarán en vigor
            inmediatamente después de su publicación en el sitio web. Es tu
            responsabilidad revisar regularmente estos términos para estar al
            tanto de cualquier cambio.
          </p>
        </div>

        <div>
          <h4 className="font-bold">Política de Privacidad</h4>
          <p>
            Para obtener información sobre cómo recopilamos, usamos y protegemos
            tu información personal, por favor revisa nuestra Política de
            Privacidad.
          </p>
        </div>

        <div>
          <h4 className="font-bold">Ley Aplicable</h4>
          <p>
            Estos términos y condiciones se regirán e interpretarán de acuerdo
            con las leyes de Argentina. Cualquier disputa que surja en relación
            con estos términos se someterá a la jurisdicción exclusiva de los
            tribunales de Mendoza.
          </p>
        </div>

        <div>
          <h4 className="font-bold">Contacto</h4>
          <p>
            Si tienes alguna pregunta sobre estos términos y condiciones, por
            favor contáctanos a través de turismomzacontact@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
