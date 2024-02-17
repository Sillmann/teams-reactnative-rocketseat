import { Header } from "@components/Header";
import { ButtonIcon } from "@components/ButtonIcon";
import { Container, Form, HeaderList, NumbersOfPlayes } from "./styles";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { Filter } from '@components/Filter';
import { FlatList, Alert, TextInput, Keyboard } from 'react-native';
import { useState, useEffect, useRef } from "react";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useRoute, useNavigation } from '@react-navigation/native';
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playerGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { AppError } from '@utils/AppError';
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { Loading } from "@components/Loading";
import { playersGetByGroup } from '@storage/player/playersGetByGroup';

type RouteParams = {
  group: string;
}

export function Players(){

  const [isLoading,setIsLoading] = useState(true);
  const [newPlayerName,setNewPlayerName] = useState('');
  const [team,setTeam] = useState('Time A');
  const [players,setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [totPlayers,setTotPlayers] = useState<PlayerStorageDTO[]>([]);
  const [addPlayers,setAddPlayers] = useState<PlayerStorageDTO[]>([]);

  const navigation = useNavigation();

  const route = useRoute();
  // title={route.params.group}
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const newPlayer = {
     name: newPlayerName,
     team,
  }


  async function handleAddPlayer(){
    if (newPlayerName.trim().length === 0){
      return Alert.alert('Nova pessoa','Informe o nome da pessoa para adicionar.');
    }

    // const newPlayer = {
    //   name: newPlayerName,
    //   team,
    // }

    try {
      
      await playerAddByGroup(newPlayer, group);
      newPlayerNameInputRef.current?.blur();
      Keyboard.dismiss();
      setNewPlayerName('');
      fetchPlayersByTeam();

      // const players = await playersGetByGroup(group);

      // console.log(players);

    } catch(error) {
      if(error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message);
      } else {
        console.log(error);
        Alert.alert('Nova pessoa','Não foi possivel adicionar.')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const playersByTeam = await playerGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
      setIsLoading(false);
    } catch(error) {
      console.log(error);
      Alert.alert('Pessoas','Não foi possivel carregar as pessoas.')
    }
  }

  async function handlePlayerRemove(playername:string){
    try {
      await playerRemoveByGroup(playername, group);
      fetchPlayersByTeam();
    } catch(error) {
      console.log(error);
      Alert.alert('Remover pessoa','Não foi possivel remover essa pessoa');
    }
  }

  async function groupRemove(){
    try{
      await groupRemoveByName(group);
      navigation.navigate('groups');
    }catch(error){
      console.log(error);
      Alert.alert('Remover Grupo','Não foi possivel remover o grupo.')
    }
  }

  async function handleGroupRemove(){
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove()}
      ]
    )
  }

  useEffect(()=>{
    fetchPlayersByTeam();
  },[team]);

  return(
    <Container>
      <Header showBackButton />
      <Highlight
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>

        <Input 
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon 
          icon="add"
          onPress={handleAddPlayer}
        />

      </Form>

      <HeaderList>

      <FlatList 
        data={['Time A','Time B']} 
        keyExtractor={item => item}    
        renderItem={({item})=>(
          <Filter
          title={item}
          isActive={item === team}
          onPress={()=>setTeam(item)}
          />
        )}
        horizontal
      />

      <NumbersOfPlayes>
        {players.length}
      </NumbersOfPlayes>
        

      </HeaderList>
      
      {
        isLoading ? <Loading /> :
      
      <FlatList
        data={players}
        keyExtractor={item => item.name}
        renderItem={({item})=>(
          <PlayerCard 
            name={item.name} 
            onRemove={()=>handlePlayerRemove(item.name)}
          />
        )}
        ListEmptyComponent={()=>(
          <ListEmpty
            message="Não há pessoas nesse time"
          />
        )} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[
          { paddingBottom: 100},
          players.length === 0 && { flex: 1}
        ]}
      />
      }
      
      <Button
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
               
    </Container>
  )
}