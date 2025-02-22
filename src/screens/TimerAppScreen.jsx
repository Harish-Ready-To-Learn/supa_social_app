import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerAppScreen = () => {
  const [timers, setTimers] = useState([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadTimers();
  }, []);

  const saveTimers = async newTimers => {
    await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
  };

  const loadTimers = async () => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (storedTimers) {
      let parsedTimers = JSON.parse(storedTimers);
      const currentTime = Date.now();
      parsedTimers = parsedTimers.map(timer => {
        if (timer.status === 'Running') {
          const elapsedTime = Math.floor(
            (currentTime - timer.startTime) / 1000,
          );
          const newRemaining = Math.max(timer.remaining - elapsedTime, 0);
          return {
            ...timer,
            remaining: newRemaining,
            status: newRemaining === 0 ? 'Completed' : 'Running',
          };
        }
        return timer;
      });
      setTimers(parsedTimers);
    }
  };

  const addTimer = () => {
    if (!name || !duration || !category) {
      Alert.alert('Please fill all fields');
      return;
    }
    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: parseInt(duration),
      remaining: parseInt(duration),
      category,
      status: 'Paused',
      startTime: null,
    };
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
    setName('');
    setDuration('');
    setCategory('');
  };

  const startTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        if (timer.status !== 'Running') {
          const newStartTime = Date.now();
          timer.status = 'Running';
          timer.startTime = newStartTime;
          timer.interval = setInterval(() => {
            setTimers(prevTimers => {
              return prevTimers.map(t => {
                if (t.id === id) {
                  if (t.remaining > 0) {
                    return {...t, remaining: t.remaining - 1};
                  } else {
                    clearInterval(t.interval);
                    return {...t, status: 'Completed'};
                  }
                }
                return t;
              });
            });
          }, 1000);
        }
      }
      return timer;
    });
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };

  const pauseTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        clearInterval(timer.interval);
        return {...timer, status: 'Paused', startTime: null};
      }
      return timer;
    });
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };

  const resetTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) {
        clearInterval(timer.interval);
        return {
          ...timer,
          remaining: timer.duration,
          status: 'Paused',
          startTime: null,
        };
      }
      return timer;
    });
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Timer</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (seconds)"
        value={duration}
        keyboardType="numeric"
        onChangeText={setDuration}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <Button title="Add Timer" onPress={addTimer} />
      <FlatList
        data={timers}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.timerCard}>
            <Text style={styles.timerText}>
              {item.name} - {item.remaining}s [{item.status}]
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => startTimer(item.id)}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => pauseTimer(item.id)}>
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => resetTimer(item.id)}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  timerCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TimerAppScreen;
