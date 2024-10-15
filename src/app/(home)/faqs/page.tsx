import AccordionCustom from '@/components/ui/AccordionCustom/AccordionCustom';

export default function FAQsPage() {
  const FAQs = [
    {
      title: '¿Qué puedo hacer en esta plataforma?',
      content:
        'En esta plataforma, puedes descubrir atractivos turísticos de Mendoza, ver reseñas de otros usuarios, calificar y comentar sobre tus visitas, guardar tus lugares favoritos y recibir notificaciones sobre novedades y eventos locales.',
    },
    {
      title: '¿Cómo puedo crear una publicación sobre un atractivo turístico?',
      content:
        'Para crear una publicación, debes registrarte y completar un formulario con los siguientes datos: título, descripción, ubicación, imágenes o videos, categoría y una página web o información de contacto si corresponde.',
    },
    {
      title: '¿Es necesario registrarse para usar la plataforma?',
      content:
        'No es necesario registrarse para navegar por las atracciones y ver las calificaciones. Sin embargo, deberás crear una cuenta para publicar comentarios, agregar favoritos, o crear una publicación sobre un atractivo.',
    },
    {
      title: '¿Cómo puedo pagar para que mi publicación aparezca destacada?',
      content:
        'Puedes pagar directamente desde tu cuenta. Una vez que tu publicación esté lista, tendrás la opción de destacar tu publicación pagando con los métodos de pago habilitados en la plataforma. Las publicaciones destacadas aparecerán cada seis publicaciones normales.',
    },
    {
      title: '¿Qué criterios se usan para destacar una publicación?',
      content:
        'Las publicaciones destacadas se muestran de forma intercalada entre las publicaciones normales, garantizando que una publicación con publicidad activa aparezca cada seis publicaciones no destacadas.',
    },
    {
      title: '¿Cómo se gestionan los comentarios ofensivos o inapropiados?',
      content:
        'Los comentarios pueden ser reportados por los usuarios. Si un comentario es marcado como inapropiado, nuestro equipo lo revisará y tomará las medidas correspondientes, que pueden incluir la eliminación del comentario o la suspensión de la cuenta del usuario que lo publicó.',
    },
    {
      title: '¿Puedo valorar las atracciones sin dejar un comentario?',
      content:
        'Sí, puedes valorar las atracciones con una calificación de estrellas sin necesidad de dejar un comentario. Sin embargo, también puedes añadir una reseña si deseas compartir más detalles sobre tu experiencia.',
    },
    {
      title: '¿Puedo guardar mis atracciones favoritas?',
      content:
        'Sí, una vez que estés registrado, puedes agregar atracciones a tu lista de favoritos para acceder fácilmente a ellas en el futuro.',
    },
    {
      title: '¿Puedo modificar o eliminar mi publicación?',
      content:
        "Sí, puedes modificar o eliminar tus publicaciones desde tu cuenta en cualquier momento. Solo debes dirigirte al apartado de 'Mis Publicaciones' y seleccionar la opción deseada.",
    },
    {
      title: '¿Cómo se generan los slugs únicos para las atracciones?',
      content:
        'El título de tu publicación se convierte automáticamente en un slug (URL amigable). Si ya existe un slug similar, se añadirá un número al final para garantizar que sea único.',
    },
    {
      title: '¿Cómo se manejan mis datos personales?',
      content:
        'Tu privacidad es importante para nosotros. Los datos que proporcionas solo se usan para el funcionamiento de la plataforma y no serán compartidos con terceros sin tu consentimiento. Consulta nuestra [Política de Privacidad] para más detalles.',
    },
    {
      title: '¿Cómo puedo reportar un problema técnico o sugerencia?',
      content:
        'Si encuentras algún problema o tienes sugerencias, puedes contactarnos a través del formulario de contacto disponible en la plataforma o enviarnos un correo a [email de soporte].',
    },
    {
      title: '¿Qué tipo de notificaciones puedo recibir?',
      content:
        'Puedes recibir notificaciones sobre nuevos atractivos turísticos, actualizaciones de tus publicaciones, comentarios en tus reseñas, y ofertas o promociones especiales relacionadas con el turismo en Mendoza.',
    },
    {
      title: '¿Qué hago si olvidé mi contraseña?',
      content:
        "Puedes restablecer tu contraseña utilizando la opción de 'Olvidé mi contraseña' en la pantalla de inicio de sesión. Te enviaremos un enlace a tu correo electrónico para que puedas crear una nueva contraseña.",
    },
    {
      title: '¿Cómo puedo darme de baja de la plataforma?',
      content:
        'Si deseas eliminar tu cuenta, puedes hacerlo desde tu perfil de usuario. Una vez eliminada, toda tu información y publicaciones asociadas serán eliminadas permanentemente.',
    },
    {
      title:
        '¿Puedo cambiar la ubicación de mi publicación después de haberla creado?',
      content:
        "Sí, puedes editar la información de tus publicaciones en cualquier momento, incluyendo la ubicación, desde la sección 'Mis Publicaciones' en tu cuenta.",
    },
    {
      title:
        '¿Qué tipo de contenido multimedia puedo agregar a una publicación?',
      content:
        'Puedes agregar imágenes y videos a tus publicaciones para hacerlas más atractivas. Asegúrate de que los archivos multimedia cumplan con nuestras pautas de calidad y tamaño máximo permitido.',
    },
    {
      title:
        '¿Qué pasa si encuentro una publicación que contiene información incorrecta?',
      content:
        'Puedes reportar publicaciones que creas que contienen información incorrecta o desactualizada. Nuestro equipo revisará el contenido y tomará las acciones necesarias para corregirlo.',
    },
    {
      title: '¿Cómo funciona la autenticación y seguridad de mi cuenta?',
      content:
        'Utilizamos autenticación mediante tokens JWT para asegurar que solo tú puedas acceder a tu cuenta. Además, implementamos las mejores prácticas de seguridad para proteger tus datos y mantener la integridad de la plataforma.',
    },
    {
      title: '¿Hay costos asociados con el uso de la plataforma?',
      content:
        'La plataforma es gratuita para explorar y publicar atracciones. Sin embargo, si deseas que tus publicaciones aparezcan destacadas, deberás pagar por ese servicio.',
    },
  ];
  return (
    <div className="flex flex-col flex-grow gap-6 p-8 md:p-12">
      <h2 className="font-bold text-3xl">Preguntas frecuentes (FAQs)</h2>
      <AccordionCustom items={FAQs} />
    </div>
  );
}
