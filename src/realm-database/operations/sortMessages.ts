import Realm,{BSON} from 'realm';
import {Messages} from '../../types/message';
import {Chat} from '../schemas/Chat';
import { Message } from '../schemas/Message';
import { getRealmInstance } from '../connection';

  const realm = getRealmInstance();

export const sortMessages = {realm:Realm } =>{
const messagesBySender = realm
  .objects('Message')
  .filtered('sender == $0', 'Naruto')
  .sorted('timestamp');
}