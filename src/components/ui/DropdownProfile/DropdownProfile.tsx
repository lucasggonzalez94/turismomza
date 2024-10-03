import DropdownButton from '../DropdownButton/DropdownButton';
import { IoNotificationsOutline } from 'react-icons/io5';

const DropdownProfile = () => {
  const options = [
    {
      id: 1,
      text: 'Ver datos del perfil',
      path: '/',
    },
    {
      id: 2,
      text: 'Configuracion',
      path: '/',
    },
  ];

  return (
    <DropdownButton position="left" profile>
      <div className="mt-2 bg-gray-200 rounded-md shadow-ms overflow-hidden">
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Perfil</h3>
        </div>
        <div>
          {options.map((option) => (
            <div
              key={option.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              <div className="flex items-center cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {option.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DropdownButton>
  );
};

export default DropdownProfile;
