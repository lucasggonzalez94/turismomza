'use client';

import React, { FC, useEffect, useState } from 'react';
import { Button, Checkbox, Input } from '@nextui-org/react';
import { IoClose } from 'react-icons/io5';
import { WEEKDAYS } from '@/utils/constants';
import { useStore } from '@/store/store';
import { Clock } from 'lucide-react';
import { DayConfig } from '@/interfaces/schedule';

interface IPropsSchedule {
  onSaveSchedule: (schedule: DayConfig[]) => void;
}

const Schedule: FC<IPropsSchedule> = ({ onSaveSchedule }) => {
  const { placeFormDetails: placeFormData } = useStore((state) => state);
  const [configSchedules, setConfigSchedules] = useState<DayConfig[]>([]);

  const toggleSelectedDay = (day: string) => {
    setConfigSchedules((prev) => {
      if (prev.find((config) => config.day === day)) {
        return prev.filter((d) => d.day !== day);
      } else {
        return [
          ...prev,
          {
            day,
            open24hours: false,
            times: [{ from: '00:00', to: '00:00' }],
          },
        ];
      }
    });
  };

  const updateTime = (
    day: string,
    index: number,
    field: 'from' | 'to',
    value: string,
  ) => {
    setConfigSchedules((prev) => {
      const indexConfig = prev.findIndex((config) => config.day === day);
      const newPrev = [...prev];
      newPrev[indexConfig] = {
        ...newPrev[indexConfig],
        times: newPrev[indexConfig].times.map((time, i) => {
          if (i === index) {
            return {
              ...time,
              [field]: value,
            };
          } else {
            return time;
          }
        }),
      };
      return newPrev;
    });
  };

  const toggleOpen24Hours = (day: string) => {
    setConfigSchedules((prev) => {
      const indexConfig = prev.findIndex((config) => config.day === day);
      const newPrev = [...prev];
      newPrev[indexConfig] = {
        ...newPrev[indexConfig],
        open24hours: !newPrev[indexConfig].open24hours,
      };
      return newPrev;
    });
  };

  const addTime = (day: string) => {
    setConfigSchedules((prev) => {
      const indexConfig = prev.findIndex((config) => config.day === day);
      const newPrev = [...prev];
      newPrev[indexConfig] = {
        ...newPrev[indexConfig],
        times: [...newPrev[indexConfig].times, { from: '00:00', to: '00:00' }],
      };
      return newPrev;
    });
  };

  const deleteTime = (day: string, index: number) => {
    setConfigSchedules((prev) => {
      const indexConfig = prev.findIndex((config) => config.day === day);
      const newPrev = [...prev];
      newPrev[indexConfig] = {
        ...newPrev[indexConfig],
        times:
          newPrev[indexConfig].times.length > 1
            ? newPrev[indexConfig].times.filter((_, i) => i === index)
            : [{ from: '00:00', to: '00:00' }],
      };
      return newPrev;
    });
  };

  useEffect(() => {
    onSaveSchedule(configSchedules);
  }, [configSchedules, onSaveSchedule]);

  useEffect(() => {
    if (placeFormData?.schedule) {
      setConfigSchedules(placeFormData?.schedule);
    }
  }, [placeFormData?.schedule]);

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
            color={
              configSchedules?.find((schedule) => schedule?.day === day)
                ? 'secondary'
                : 'default'
            }
            onPress={() => toggleSelectedDay(day)}
            className="rounded-full"
          >
            {day}
          </Button>
        ))}
      </div>

      {configSchedules && configSchedules.map(({ day, open24hours, times }) => (
        <div
          key={day}
          className="mb-4 p-4 border border-gray-300 rounded-lg bg-[#e9e9e9]"
        >
          <h2 className="text-lg font-semibold mb-2">{day}</h2>
          <Checkbox
            isSelected={open24hours}
            onValueChange={() => toggleOpen24Hours(day)}
            className="mb-2"
          >
            Abierto las 24 horas
          </Checkbox>

          {!open24hours &&
            times.map((time, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  type="time"
                  label="Desde"
                  placeholder="00:00"
                  variant="faded"
                  value={time.from}
                  onChange={(e) =>
                    updateTime(day, index, 'from', e.target.value)
                  }
                  startContent={<Clock className="text-gray-400" size={16} />}
                  className="w-32"
                />
                <Input
                  type="time"
                  label="Hasta"
                  placeholder="00:00"
                  variant="faded"
                  value={time.to}
                  onChange={(e) => updateTime(day, index, 'to', e.target.value)}
                  startContent={<Clock className="text-gray-400" size={16} />}
                  className="w-32"
                />
                <Button
                  className="text-white bg-red-700 hover:bg-red-500"
                  isIconOnly
                  onPress={() => deleteTime(day, index)}
                >
                  <IoClose size={20} />
                </Button>
              </div>
            ))}

          {!open24hours && (
            <Button
              className="bg-black hover:bg-gray-900 text-white mt-2"
              size="sm"
              onPress={() => addTime(day)}
              isDisabled={times.some(
                (time) => time?.from === '' || time?.to === '',
              )}
            >
              Agregar horario
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Schedule;
