'use client';

import React, { useState } from 'react';
import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { IoClose } from 'react-icons/io5';

const weekDays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

interface Time {
  from: string;
  to: string;
}

interface DayConfig {
  open24hours: boolean;
  times: Time[];
}

const Schedule = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [config, setConfig] = useState<Record<string, DayConfig>>(
    Object.fromEntries(
      weekDays.map((day) => [
        day,
        {
          open24hours: false,
          times: [{ from: '09:00', to: '18:00' }],
        },
      ]),
    ),
  );

  const toggleSelectedDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const updateTime = (
    day: string,
    index: number,
    field: 'from' | 'to',
    value: string,
  ) => {
    setConfig((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        times: prev[day].times.map((h, i) =>
          i === index ? { ...h, [field]: value } : h,
        ),
      },
    }));
  };

  const toggleOpen24Hours = (day: string) => {
    setConfig((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        open24hours: !prev[day].open24hours,
      },
    }));
  };

  const addTime = (day: string) => {
    setConfig((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        times: [...prev[day].times, { from: '09:00', to: '18:00' }],
      },
    }));
  };

  const deleteTime = (day: string, index: number) => {
    setConfig((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        times: prev[day].times.filter((_, i) => i !== index),
      },
    }));
  };

  const saveConfig = () => {
    console.log('Configuración guardada:', config);
    // Aquí iría la lógica para guardar la configuración
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>,
        );
      }
    }
    return options;
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-4">Horarios</h1>
      <p className="mb-4">
        Selecciona un día para ajustar los horarios de atención
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {weekDays.map((day) => (
          <Button
            key={day}
            color={selectedDays.includes(day) ? 'secondary' : 'default'}
            onClick={() => toggleSelectedDay(day)}
            className="rounded-full"
          >
            {day}
          </Button>
        ))}
      </div>

      {selectedDays.map((day) => (
        <div key={day} className="mb-4 p-4 border border-gray-300 rounded-lg bg-[#e9e9e9]">
          <h2 className="text-lg font-semibold mb-2">{day}</h2>
          <Checkbox
            isSelected={config[day].open24hours}
            onValueChange={() => toggleOpen24Hours(day)}
            className="mb-2"
          >
            Abierto las 24 horas
          </Checkbox>

          {!config[day].open24hours &&
            config[day].times.map((horario, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Select
                  label="Desde"
                  value={horario.from}
                  onChange={(e) =>
                    updateTime(day, index, 'from', e.target.value)
                  }
                  size="sm"
                  className="w-32"
                >
                  {generateTimeOptions()}
                </Select>
                <Select
                  label="Hasta"
                  value={horario.to}
                  onChange={(e) => updateTime(day, index, 'to', e.target.value)}
                  size="sm"
                  className="w-32"
                >
                  {generateTimeOptions()}
                </Select>
                <Button
                  color="danger"
                  isIconOnly
                  onClick={() => deleteTime(day, index)}
                  isDisabled={config[day].times.length === 1}
                >
                  <IoClose size={20} />
                </Button>
              </div>
            ))}

          {!config[day].open24hours && (
            <Button
              color="secondary"
              size="sm"
              onClick={() => addTime(day)}
              className="mt-2"
            >
              Agregar horario
            </Button>
          )}
        </div>
      ))}

      <div className="flex justify-start gap-2 mt-4">
        <Button color="default">Cancelar</Button>
        <Button color="primary" onClick={saveConfig}>
          Guardar horarios
        </Button>
      </div>
    </div>
  );
}

export default Schedule;
