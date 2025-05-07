import { CreateTableCommand, ScalarAttributeType, KeyType } from '@aws-sdk/client-dynamodb'

import client from '../app/services/dynamo.js'

const params = {
  TableName: 'Products',
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: ScalarAttributeType.S,
    },
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: KeyType.HASH, 
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
}

async function createTable() {
  try {
    const result = await client.send(new CreateTableCommand(params))
    console.log('Tabela criada com sucesso:', result)
  } catch (err) {
    console.error('Erro ao criar tabela:', err)
  }
}

createTable()
