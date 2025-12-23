export const confidentialMemeFactoryAbi = [
  {
    type: 'error',
    name: 'InvalidTokenMetadata',
    inputs: [],
  },
  {
    type: 'event',
    name: 'TokenCreated',
    inputs: [
      {
        name: 'creator',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
      },
      {
        name: 'name',
        type: 'string',
        indexed: false,
      },
      {
        name: 'symbol',
        type: 'string',
        indexed: false,
      },
      {
        name: 'maxSupply',
        type: 'uint64',
        indexed: false,
      },
    ],
  },
  {
    type: 'function',
    name: 'DEFAULT_SUPPLY',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createToken',
    inputs: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'symbol',
        type: 'string',
      },
      {
        name: 'maxSupply',
        type: 'uint64',
      },
    ],
    outputs: [
      {
        name: 'token',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getAllTokens',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTokensByCreator',
    inputs: [
      {
        name: 'creator',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
] as const;
