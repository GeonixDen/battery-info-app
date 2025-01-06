// src/BatteryStatus.jsx
import React, { useEffect, useState } from 'react';

const BatteryStatus = () => {
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [isCharging, setIsCharging] = useState(null);
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        let battery = null;

        const updateBatteryInfo = () => {
            if (battery) {
                setBatteryLevel(Math.round(battery.level * 100));
                setIsCharging(battery.charging);
            }
        };

        const handleLevelChange = () => {
            setBatteryLevel(Math.round(battery.level * 100));
        };

        const handleChargingChange = () => {
            setIsCharging(battery.charging);
        };

        if ('getBattery' in navigator) {
            navigator.getBattery().then((bat) => {
                battery = bat;
                updateBatteryInfo();

                // Подписываемся на события изменения уровня батареи и статуса зарядки
                battery.addEventListener('levelchange', handleLevelChange);
                battery.addEventListener('chargingchange', handleChargingChange);
            }).catch((error) => {
                console.error('Ошибка при получении информации о батарее:', error);
                setSupported(false);
            });
        } else {
            console.warn('Battery Status API не поддерживается в этом браузере.');
            setSupported(false);
        }

        // Очистка подписок при размонтировании компонента
        return () => {
            if (battery) {
                battery.removeEventListener('levelchange', handleLevelChange);
                battery.removeEventListener('chargingchange', handleChargingChange);
            }
        };
    }, []);

    if (!supported) {
        return <div>Информация о батарее недоступна в вашем браузере.</div>;
    }

    return (
        <div style={styles.container}>
            <h1>Информация о батарее</h1>
            {batteryLevel !== null ? (
                <p>Уровень батареи: {batteryLevel}%</p>
            ) : (
                <p>Загрузка уровня батареи...</p>
            )}
            {isCharging !== null ? (
                <p>Статус зарядки: {isCharging ? 'Заряжается' : 'Не заряжается'}</p>
            ) : (
                <p>Загрузка статуса зарядки...</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'grey',
        fontFamily: 'Arial, sans-serif',
    },
};

export default BatteryStatus;
