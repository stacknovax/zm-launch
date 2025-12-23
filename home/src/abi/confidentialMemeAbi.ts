export const confidentialMemeAbi = [
  {
    type: 'error',
    name: 'ERC7984InvalidGatewayRequest',
    inputs: [
      {
        name: 'requestId',
        type: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC7984InvalidReceiver',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC7984InvalidSender',
    inputs: [
      {
        name: 'sender',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC7984UnauthorizedCaller',
    inputs: [
      {
        name: 'caller',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC7984UnauthorizedSpender',
    inputs: [
      {
        name: 'holder',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC7984UnauthorizedUseOfEncryptedAmount',
    inputs: [
      {
        name: 'amount',
        type: 'bytes32',
      },
      {
        name: 'user',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ERC7984ZeroBalance',
    inputs: [
      {
        name: 'holder',
        type: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidCreator',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidTokenMetadata',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MaxSupplyExceeded',
    inputs: [
      {
        name: 'requested',
        type: 'uint64',
      },
      {
        name: 'remaining',
        type: 'uint64',
      },
    ],
  },
  {
    type: 'error',
    name: 'ZeroAmount',
    inputs: [],
  },
  {
    type: 'event',
    name: 'AmountDiscloseRequested',
    inputs: [
      {
        name: 'encryptedAmount',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'requester',
        type: 'address',
        indexed: true,
      },
    ],
  },
  {
    type: 'event',
    name: 'AmountDisclosed',
    inputs: [
      {
        name: 'encryptedAmount',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'amount',
        type: 'uint64',
        indexed: false,
      },
    ],
  },
  {
    type: 'event',
    name: 'ConfidentialTransfer',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        type: 'bytes32',
        indexed: true,
      },
    ],
  },
  {
    type: 'event',
    name: 'FreeMint',
    inputs: [
      {
        name: 'minter',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'encryptedAmount',
        type: 'bytes32',
        indexed: false,
      },
    ],
  },
  {
    type: 'event',
    name: 'OperatorSet',
    inputs: [
      {
        name: 'holder',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        type: 'address',
        indexed: true,
      },
      {
        name: 'until',
        type: 'uint48',
        indexed: false,
      },
    ],
  },
  {
    type: 'function',
    name: 'confidentialBalanceOf',
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'confidentialTotalSupply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'confidentialTransfer',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        name: 'inputProof',
        type: 'bytes',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'confidentialTransfer',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'bytes32',
      },
    ],
    outputs: [
      {
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'confidentialTransferAndCall',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        name: 'inputProof',
        type: 'bytes',
      },
      {
        name: 'data',
        type: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'confidentialTransferAndCall',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'bytes32',
      },
      {
        name: 'data',
        type: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'confidentialTransferFrom',
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        name: 'inputProof',
        type: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'confidentialTransferFrom',
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'bytes32',
      },
    ],
    outputs: [
      {
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'confidentialTransferFromAndCall',
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        name: 'inputProof',
        type: 'bytes',
      },
      {
        name: 'data',
        type: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'confidentialTransferFromAndCall',
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'bytes32',
      },
      {
        name: 'data',
        type: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'transferred',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'contractURI',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'creator',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'discloseEncryptedAmount',
    inputs: [
      {
        name: 'encryptedAmount',
        type: 'bytes32',
      },
      {
        name: 'cleartextAmount',
        type: 'uint64',
      },
      {
        name: 'decryptionProof',
        type: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'freeMint',
    inputs: [
      {
        name: 'amount',
        type: 'uint64',
      },
    ],
    outputs: [
      {
        name: 'minted',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isOperator',
    inputs: [
      {
        name: 'holder',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxSupply',
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
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'remainingSupply',
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
    name: 'requestDiscloseEncryptedAmount',
    inputs: [
      {
        name: 'encryptedAmount',
        type: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setOperator',
    inputs: [
      {
        name: 'operator',
        type: 'address',
      },
      {
        name: 'until',
        type: 'uint48',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [
      {
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalMinted',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
  },
] as const;
