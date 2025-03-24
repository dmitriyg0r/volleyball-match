import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';
import { toJpeg } from 'html-to-image';

function App() {
  const [matchData, setMatchData] = useState({
    title: 'Кубок Команд',
    score: 'Счёт партий: 0 : 0',
    scoreTeamSarmat: 0,
    scoreTeamDima: 0,
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
      try {
        const parsedData = JSON.parse(storedData);
        setMatchData(parsedData);
      } catch (e) {
        console.error('Ошибка при чтении данных из localStorage:', e);
        localStorage.removeItem('volleyballMatchData');
      }
    }
    
    const storedStats = localStorage.getItem('volleyballPersonalStats');
    if (storedStats) {
      try {
        const parsedStats = JSON.parse(storedStats);
        setPersonalStats(parsedStats);
      } catch (e) {
        console.error('Ошибка при чтении статистики из localStorage:', e);
        localStorage.removeItem('volleyballPersonalStats');
      }
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
        const scoreMatch = value.match(/(\d+)\s*:\s*(\d+)/);
        if (scoreMatch) {
          newData.scoreTeamSarmat = parseInt(scoreMatch[1]) || 0;
          newData.scoreTeamDima = parseInt(scoreMatch[2]) || 0;
        }
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

  const sortedPersonalStats = useMemo(() => {
    return [...personalStats].sort((a, b) => b.points - a.points);
  }, [personalStats]);

  const downloadTableAsJpeg = async () => {
    if (containerRef.current) {
      try {
        const downloadButtons = document.querySelectorAll('.download-button');
        const addPlayerForm = document.querySelector('.add-player-form');
        
        if (downloadButtons) downloadButtons.forEach(btn => btn.style.display = 'none');
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
        
        if (downloadButtons) downloadButtons.forEach(btn => btn.style.display = 'block');
        if (addPlayerForm) addPlayerForm.style.display = 'flex';
        
        const link = document.createElement('a');
        link.download = 'volleyball_match.jpeg';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading match as JPEG:', error);
        const downloadButtons = document.querySelectorAll('.download-button');
        const addPlayerForm = document.querySelector('.add-player-form');
        
        if (downloadButtons) downloadButtons.forEach(btn => btn.style.display = 'block');
        if (addPlayerForm) addPlayerForm.style.display = 'flex';
      }
    }
  };
  
  const downloadPersonalStatsAsJpeg = async () => {
    if (personalStatsRef.current) {
      try {
        const downloadButtons = document.querySelectorAll('.download-button');
        const addPlayerForm = document.querySelector('.add-player-form');
        
        if (downloadButtons) downloadButtons.forEach(btn => btn.style.display = 'none');
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
        
        if (downloadButtons) downloadButtons.forEach(btn => btn.style.display = 'block');
        if (addPlayerForm) addPlayerForm.style.display = 'flex';
        
        const link = document.createElement('a');
        link.download = 'personal_stats.jpeg';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading personal stats as JPEG:', error);
        const downloadButtons = document.querySelectorAll('.download-button');
        const addPlayerForm = document.querySelector('.add-player-form');
        
        if (downloadButtons) downloadButtons.forEach(btn => btn.style.display = 'block');
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

  const handleScoreChange = (team, increment = true) => {
    setMatchData(prevData => {
      const newData = { ...prevData };
      
      if (team === 'sarmat') {
        newData.scoreTeamSarmat = increment 
          ? newData.scoreTeamSarmat + 1 
          : Math.max(0, newData.scoreTeamSarmat - 1);
      } else if (team === 'dima') {
        newData.scoreTeamDima = increment 
          ? newData.scoreTeamDima + 1 
          : Math.max(0, newData.scoreTeamDima - 1);
      }
      
      newData.score = `Счёт партий: ${newData.scoreTeamSarmat} : ${newData.scoreTeamDima}`;
      return newData;
    });
  };
  
  const handleResetData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('volleyballMatchData');
      localStorage.removeItem('volleyballPersonalStats');
      window.location.reload();
    }
  };

  const handleSarmatTeamHeaderBlur = (e) => {
    const text = e.target.innerText;
    const parts = text.split(' ');
    if (parts.length > 1) {
      const captainName = parts.pop().replace(')', '');
      const teamHeader = parts.join(' ');
      handleHeaderChange('sarmatTeam', teamHeader);
      handleCaptainChange('sarmat', captainName);
    }
  };

  const handleDimaTeamHeaderBlur = (e) => {
    const text = e.target.innerText;
    const parts = text.split(' ');
    if (parts.length > 1) {
      const captainName = parts.pop().replace(')', '');
      const teamHeader = parts.join(' ');
      handleHeaderChange('dimaTeam', teamHeader);
      handleCaptainChange('dima', captainName);
    }
  };

  return (
    <div className="container" ref={containerRef}>
      <h1>
        <div 
          contentEditable="true" 
          onBlur={e => handleInputChange('title', null, e.target.innerText)}
          suppressContentEditableWarning={true}
        >
          {matchData.title}
        </div>
      </h1>
      <div className="score-container">
        <div className="score">
          <div
            contentEditable="true"
            onBlur={e => handleInputChange('score', null, e.target.innerText)}
            suppressContentEditableWarning={true}
          >
            {matchData.score}
          </div>
        </div>
      
        <table ref={tableRef}>
          <thead>
            <tr>
              <th className="team-sarmat">
                <div 
                  contentEditable="true" 
                  onBlur={e => handleHeaderChange('number', e.target.innerText)}
                  suppressContentEditableWarning={true}
                >
                  {matchData.headers.number}
                </div>
              </th>
              <th className="team-sarmat">
                <div contentEditable="true" 
                     onBlur={handleSarmatTeamHeaderBlur}
                     suppressContentEditableWarning={true}>
                  {matchData.headers.sarmatTeam} {matchData.teamSarmat.captain})
                </div>
              </th>
              <th className="team-dima">
                <div 
                  contentEditable="true" 
                  onBlur={e => handleHeaderChange('number', e.target.innerText)}
                  suppressContentEditableWarning={true}
                >
                  {matchData.headers.number}
                </div>
              </th>
              <th className="team-dima">
                <div contentEditable="true" 
                     onBlur={handleDimaTeamHeaderBlur}
                     suppressContentEditableWarning={true}>
                  {matchData.headers.dimaTeam} {matchData.teamDima.captain})
                </div>
              </th>
              <th className="substitutes">
                <div 
                  contentEditable="true" 
                  onBlur={e => handleHeaderChange('number', e.target.innerText)}
                  suppressContentEditableWarning={true}
                >
                  {matchData.headers.number}
                </div>
              </th>
              <th className="substitutes">
                <div 
                  contentEditable="true" 
                  onBlur={e => handleHeaderChange('substitutes', e.target.innerText)}
                  suppressContentEditableWarning={true}
                >
                  {matchData.headers.substitutes}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={i}>
                <td contentEditable="true" onBlur={e => handleNumberChange('sarmat', i, e.target.innerText)}
                    suppressContentEditableWarning={true}>
                  {matchData.teamSarmat.numbers[i]}
                </td>
                <td contentEditable="true" onBlur={e => handleInputChange('sarmat', i, e.target.innerText)}
                    suppressContentEditableWarning={true}>
                  {matchData.teamSarmat.players[i]}
                </td>
                <td contentEditable="true" onBlur={e => handleNumberChange('dima', i, e.target.innerText)}
                    suppressContentEditableWarning={true}>
                  {matchData.teamDima.numbers[i]}
                </td>
                <td contentEditable="true" onBlur={e => handleInputChange('dima', i, e.target.innerText)}
                    suppressContentEditableWarning={true}>
                  {matchData.teamDima.players[i]}
                </td>
                <td className="sub-col" contentEditable="true" onBlur={e => handleNumberChange('substitutes', i, e.target.innerText)}
                    suppressContentEditableWarning={true}>
                  {matchData.substituteNumbers[i]}
                </td>
                <td className="sub-col" contentEditable="true" onBlur={e => handleInputChange('substitutes', i, e.target.innerText)}
                    suppressContentEditableWarning={true}>
                  {matchData.substitutes[i]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
            {sortedPersonalStats.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td 
                  contentEditable="true" 
                  onBlur={e => handleStatChange(personalStats.findIndex(p => p === player), 'name', e.target.innerText)}
                  suppressContentEditableWarning={true}
                >
                  {player.name}
                </td>
                <td 
                  contentEditable="true" 
                  onBlur={e => handleStatChange(personalStats.findIndex(p => p === player), 'points', e.target.innerText)}
                  suppressContentEditableWarning={true}
                >
                  {player.points}
                </td>
                <td className="action-column">
                  <button className="remove-btn" onClick={() => handleRemovePlayer(personalStats.findIndex(p => p === player))}>✕</button>
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
      
      <div className="controls-container">
        <button className="reset-button" onClick={handleResetData}>Сбросить все данные</button>
      </div>
    </div>
  );
}

export default App;
