import React from 'react';
import Snowfall from 'react-snowfall';

const SnowBackground: React.FC = () => {
    return (
        <div style={{ 
            position: 'fixed', 
            width: '100%', 
            height: '100%', 
            top: 0,
            left: 0,
            pointerEvents: 'none'
        }}>
            <Snowfall 
                snowflakeCount={100}
                radius={[0.5, 3.0]}
                speed={[1, 1]}
                wind={[-0.5, 2]}
                color="#fff"
                style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                }}
            />
        </div>
    );
};

export default SnowBackground; 