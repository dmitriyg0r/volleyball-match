import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { toJpeg } from 'html-to-image';

function App() {
  const [matchData, setMatchData] = useState({
    title: 'Кубок Команд',
    score: 'Счёт партий: 0 : 0',
    teamSarmat: {
      captain: 'Сармат',
      players: ['Гриша', 'Толя', 'Максим', 'Клауд', 'Андрей'],
      numbers: [1, 2, 3, 4, 5]
    },
    teamDima: {
      captain: 'Дима',
      players: ['Нисан', 'Маша', 'Паша', 'Дима', 'Веня'],
      numbers: [1, 2, 3, 4, 5]
    },
    substitutes: ['Илкин (резерв для Димы)', 'Слава (универсальный)', 'Камень (резерв для Сармата)', 'Даня (универсальный)', ''],
    substituteNumbers: [1, 2, 3, 4, 5],
    headers: {
      sarmatTeam: 'Команда Сармат (Капитан:',
      dimaTeam: 'Команда Дима (Капитан:',
      substitutes: 'Скамейка запасных',
      number: '№'
    }
  });
  
  const [personalStats, setPersonalStats] = useState([
    { name: '', points: 0 }
  ]);
  
  const [newPlayer, setNewPlayer] = useState({ name: '', points: 0 });

  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const personalStatsRef = useRef(null);

  useEffect(() => {
    const storedData = localStorage.getItem('volleyballMatchData');
    if (storedData) {
      setMatchData(JSON.parse(storedData));
    }
    
    const storedStats = localStorage.getItem('volleyballPersonalStats');
    if (storedStats) {
      setPersonalStats(JSON.parse(storedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('volleyballMatchData', JSON.stringify(matchData));
  }, [matchData]);
  
  useEffect(() => {
    localStorage.setItem('volleyballPersonalStats', JSON.stringify(personalStats));
  }, [personalStats]);

  const handleInputChange = (team, playerIndex, value) => {
    setMatchData(prevData => {
      const newData = { ...prevData };
      if (team === 'sarmat') {
        newData.teamSarmat.players[playerIndex] = value;
      } else if (team === 'dima') {
        newData.teamDima.players[playerIndex] = value;
      } else if (team === 'substitutes') {
        newData.substitutes[playerIndex] = value;
      } else if (team === 'score') {
        newData.score = value;
      } else if (team === 'title') {
        newData.title = value;
      }
      return newData;
    });
  };

  const handleCaptainChange = (team, value) => {
    setMatchData(prevData => ({
      ...prevData,
      [team === 'sarmat' ? 'teamSarmat' : 'teamDima']: {
        ...prevData[team === 'sarmat' ? 'teamSarmat' : 'teamDima'],
        captain: value,
      },
    }));
  };

  const handleHeaderChange = (headerType, value) => {
    setMatchData(prevData => {
      const newData = { ...prevData };
      newData.headers[headerType] = value;
      return newData;
    });
  };

  const handleNumberChange = (team, index, value) => {
    setMatchData(prevData => {
      const newData = { ...prevData };
      let numValue = parseInt(value) || index + 1;
      
      if (team === 'sarmat') {
        newData.teamSarmat.numbers[index] = numValue;
      } else if (team === 'dima') {
        newData.teamDima.numbers[index] = numValue;
      } else if (team === 'substitutes') {
        newData.substituteNumbers[index] = numValue;
      }
      
      return newData;
    });
  };

  const downloadTableAsJpeg = async () => {
    if (containerRef.current) {
      try {
        // Временно скрываем кнопки и форму перед экспортом
        const downloadButtons = document.querySelectorAll('.download-button');
        const addPlayerForm = document.querySelector('.add-player-form');
        downloadButtons.forEach(btn => btn.style.display = 'none');
        if (addPlayerForm) addPlayerForm.style.display = 'none';
        
        const dataUrl = await toJpeg(containerRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          skipAutoScale: true,
          backgroundColor: '#ffffff',
          style: {
            transform: 'none',
            transformOrigin: 'none'
          }
        });
        
        // Возвращаем отображение кнопок и формы
        downloadButtons.forEach(btn => btn.style.display = 'block');
        if (addPlayerForm) addPlayerForm.style.display = 'flex';
        
        const link = document.createElement('a');
        link.download = 'volleyball_match.jpeg';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading match as JPEG:', error);
        // В случае ошибки убедимся, что кнопки и форма снова видимы
        const downloadButtons = document.querySelectorAll('.download-button');
        const addPlayerForm = document.querySelector('.add-player-form');
        downloadButtons.forEach(btn => btn.style.display = 'block');
        if (addPlayerForm) addPlayerForm.style.display = 'flex';
      }
    }
  };
  
  const downloadPersonalStatsAsJpeg = async () => {
    if (personalStatsRef.current) {
      try {
        // Временно скрываем кнопки и форму перед экспортом
        const downloadButtons = document.querySelectorAll('.download-button');
        const addPlayerForm = document.querySelector('.add-player-form');
        downloadButtons.forEach(btn => btn.style.display = 'none');
        if (addPlayerForm) addPlayerForm.style.display = 'none';
        
        const dataUrl = await toJpeg(personalStatsRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          skipAutoScale: true,
          backgroundColor: '#ffffff',
          style: {
            transform: 'none',
            transformOrigin: 'none'
          }
        });
        
        // Возвращаем отображение кнопок и формы
        downloadButtons.forEach(btn => btn.style.display = 'block');
        if (addPlayerForm) addPlayerForm.style.display = 'flex';
        
        const link = document.createElement('a');
        link.download = 'personal_stats.jpeg';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading personal stats as JPEG:', error);
        // В случае ошибки убедимся, что кнопки и форма снова видимы
        const downloadButtons = document.querySelectorAll('.download-button');
        const addPlayerForm = document.querySelector('.add-player-form');
        downloadButtons.forEach(btn => btn.style.display = 'block');
        if (addPlayerForm) addPlayerForm.style.display = 'flex';
      }
    }
  };
  
  const handleStatChange = (index, field, value) => {
    setPersonalStats(prevStats => {
      const newStats = [...prevStats];
      newStats[index] = { ...newStats[index], [field]: field === 'points' ? parseInt(value) || 0 : value };
      return newStats;
    });
  };
  
  const handleAddPlayer = () => {
    if (newPlayer.name.trim()) {
      setPersonalStats(prevStats => [...prevStats, { ...newPlayer }]);
      setNewPlayer({ name: '', points: 0 });
    }
  };
  
  const handleRemovePlayer = (index) => {
    setPersonalStats(prevStats => prevStats.filter((_, i) => i !== index));
  };

  return (
    <div className="container" ref={containerRef}>
      <h1 contentEditable="true" onBlur={e => handleInputChange('title', null, e.target.innerText)}>
        {matchData.title}
      </h1>
      <div className="score" contentEditable="true" onBlur={e => handleInputChange('score', null, e.target.innerText)}>
        {matchData.score}
      </div>
      <table ref={tableRef}>
        <thead>
          <tr>
            <th className="team-sarmat" contentEditable="true" onBlur={e => handleHeaderChange('number', e.target.innerText)}>
              {matchData.headers.number}
            </th>
            <th className="team-sarmat" contentEditable="true">
              <span contentEditable="true" onBlur={e => handleHeaderChange('sarmatTeam', e.target.innerText)}>
                {matchData.headers.sarmatTeam}
              </span> 
              <span contentEditable="true" onBlur={e => handleCaptainChange('sarmat', e.target.innerText)}>
                {matchData.teamSarmat.captain}
              </span>)
            </th>
            <th className="team-dima" contentEditable="true" onBlur={e => handleHeaderChange('number', e.target.innerText)}>
              {matchData.headers.number}
            </th>
            <th className="team-dima" contentEditable="true">
              <span contentEditable="true" onBlur={e => handleHeaderChange('dimaTeam', e.target.innerText)}>
                {matchData.headers.dimaTeam}
              </span> 
              <span contentEditable="true" onBlur={e => handleCaptainChange('dima', e.target.innerText)}>
                {matchData.teamDima.captain}
              </span>)
            </th>
            <th className="substitutes" contentEditable="true" onBlur={e => handleHeaderChange('number', e.target.innerText)}>
              {matchData.headers.number}
            </th>
            <th className="substitutes" contentEditable="true" onBlur={e => handleHeaderChange('substitutes', e.target.innerText)}>
              {matchData.headers.substitutes}
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_, i) => (
            <tr key={i}>
              <td contentEditable="true" onBlur={e => handleNumberChange('sarmat', i, e.target.innerText)}>
                {matchData.teamSarmat.numbers[i]}
              </td>
              <td contentEditable="true" onBlur={e => handleInputChange('sarmat', i, e.target.innerText)}>
                {matchData.teamSarmat.players[i]}
              </td>
              <td contentEditable="true" onBlur={e => handleNumberChange('dima', i, e.target.innerText)}>
                {matchData.teamDima.numbers[i]}
              </td>
              <td contentEditable="true" onBlur={e => handleInputChange('dima', i, e.target.innerText)}>
                {matchData.teamDima.players[i]}
              </td>
              <td className="sub-col" contentEditable="true" onBlur={e => handleNumberChange('substitutes', i, e.target.innerText)}>
                {matchData.substituteNumbers[i]}
              </td>
              <td className="sub-col" contentEditable="true" onBlur={e => handleInputChange('substitutes', i, e.target.innerText)}>
                {matchData.substitutes[i]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="download-button" onClick={downloadTableAsJpeg}>Скачать таблицу как JPEG</button>
      
      <div className="personal-stats-container" ref={personalStatsRef}>
        <h2>Личный зачёт</h2>
        <table className="personal-stats-table">
          <thead>
            <tr>
              <th className="player-stats">№</th>
              <th className="player-stats">Игрок</th>
              <th className="player-stats">Очки</th>
              <th className="action-column">Действия</th>
            </tr>
          </thead>
          <tbody>
            {personalStats.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td 
                  contentEditable="true" 
                  onBlur={e => handleStatChange(index, 'name', e.target.innerText)}
                >
                  {player.name}
                </td>
                <td 
                  contentEditable="true" 
                  onBlur={e => handleStatChange(index, 'points', e.target.innerText)}
                >
                  {player.points}
                </td>
                <td className="action-column">
                  <button className="remove-btn" onClick={() => handleRemovePlayer(index)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="add-player-form">
        <input 
          type="text" 
          placeholder="Имя игрока" 
          value={newPlayer.name}
          onChange={e => setNewPlayer({...newPlayer, name: e.target.value})}
        />
        <input 
          type="number" 
          placeholder="Очки" 
          value={newPlayer.points}
          onChange={e => setNewPlayer({...newPlayer, points: parseInt(e.target.value) || 0})}
        />
        <button onClick={handleAddPlayer}>Добавить игрока</button>
      </div>
      
      <button className="download-button" onClick={downloadPersonalStatsAsJpeg}>Скачать личный зачёт как JPEG</button>
    </div>
  );
}

export default App;
