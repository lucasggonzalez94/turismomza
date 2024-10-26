'use client';

import React, { FC, useEffect, useState } from 'react';
import { Button, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { IoClose } from 'react-icons/io5';
import { WEEKDAYS } from '@/utils/constants';
import { useStore } from '@/store/store';
import { DayConfig } from '@/interfaces/schedule';
import { validateSchedule } from '@/utils/helpers';

interface IPropsSchedule {
  onSaveSchedule: (schedule: Record<string, DayConfig>) => void;
  error: string;
  setError: (error: string) => void;
}

const Schedule: FC<IPropsSchedule> = ({ onSaveSchedule, error, setError }) => {
  const { schedule, setSchedule } = useStore((state) => state);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [config, setConfig] = useState<Record<string, DayConfig>>(
    schedule?.config ||
      Object.fromEntries(
        WEEKDAYS.map((day) => [
          day,
          {
            open24hours: false,
            times: [{ from: '', to: '' }],
          },
        ]),
      ),
  );
  const [saved, setSaved] = useState(false);

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
    setError('');
    setSaved((prev) => !prev);
    onSaveSchedule(config);
    setSchedule({
      selectedDays,
      config,
    });
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

  useEffect(() => {
    if (schedule) {
      setSelectedDays(schedule?.selectedDays);
      setConfig(schedule?.config);
    }
  }, [schedule]);

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-4">Horarios</h1>
      <p className="mb-4">
        Selecciona un día para ajustar los horarios de atención
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {WEEKDAYS.map((day) => (
          <Button
            key={day}
            color={selectedDays.includes(day) ? 'secondary' : 'default'}
            onClick={() => toggleSelectedDay(day)}
            className="rounded-full"
            isDisabled={saved}
          >
            {day}
          </Button>
        ))}
      </div>

      {saved ? (
        <>
          {selectedDays.map((day) => (
            <div
              key={day}
              className="mb-4 p-4 border border-gray-300 rounded-lg bg-[#e9e9e9]"
            >
              <h2 className="text-lg font-semibold mb-2">{day}</h2>
              {config[day].open24hours && <span>Abierto las 24 horas</span>}

              {!config[day].open24hours &&
                config[day].times.map((horario, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span>Desde: {horario.from}</span>
                    <span> - </span>
                    <span>Hasta: {horario.to}</span>
                  </div>
                ))}
            </div>
          ))}
        </>
      ) : (
        <>
          {selectedDays.map((day) => (
            <div
              key={day}
              className="mb-4 p-4 border border-gray-300 rounded-lg bg-[#e9e9e9]"
            >
              <h2 className="text-lg font-semibold mb-2">{day}</h2>
              <Checkbox
                isSelected={config[day].open24hours}
                onValueChange={() => toggleOpen24Hours(day)}
                className="mb-2"
              >
                Abierto las 24 horas
              </Checkbox>

              {!config[day].open24hours &&
                config[day].times.map((time, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Select
                      label="Desde"
                      defaultSelectedKeys={[time.from]}
                      value={time.from}
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
                      defaultSelectedKeys={[time.to]}
                      value={time.to}
                      onChange={(e) =>
                        updateTime(day, index, 'to', e.target.value)
                      }
                      size="sm"
                      className="w-32"
                    >
                      {generateTimeOptions()}
                    </Select>
                    <Button
                      className="text-white bg-red-700 hover:bg-red-500"
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
                  className="bg-black hover:bg-gray-900 text-white mt-2"
                  size="sm"
                  onClick={() => addTime(day)}
                >
                  Agregar horario
                </Button>
              )}
            </div>
          ))}
        </>
      )}

      <span className="text-sm text-red-500">{error}</span>

      <div className="flex justify-start gap-2 mt-4">
        <Button
          className="bg-black hover:bg-gray-900 text-white"
          onClick={saveConfig}
          isDisabled={!validateSchedule(config)}
        >
          {saved ? 'Editar horarios' : 'Guardar horarios'}
        </Button>
      </div>
    </div>
  );
};

export default Schedule;
