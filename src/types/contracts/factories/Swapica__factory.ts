/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Swapica, SwapicaInterface } from "../Swapica";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "enum ISwapica.State",
            name: "state",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "originOrderId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenToSell",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToSell",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "originChainId",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct ISwapica.Match",
        name: "match_",
        type: "tuple",
      },
    ],
    name: "MatchCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "matchId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum ISwapica.State",
        name: "status",
        type: "uint8",
      },
    ],
    name: "MatchUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "enum ISwapica.State",
                name: "state",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "matchId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "matchSwapica",
                type: "address",
              },
            ],
            internalType: "struct ISwapica.OrderStatus",
            name: "status",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenToSell",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToSell",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenToBuy",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToBuy",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "destinationChain",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct ISwapica.Order",
        name: "order",
        type: "tuple",
      },
    ],
    name: "OrderCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "enum ISwapica.State",
            name: "state",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "matchSwapica",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct ISwapica.OrderStatus",
        name: "status",
        type: "tuple",
      },
    ],
    name: "OrderUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "signers_",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "signaturesThreshold_",
        type: "uint256",
      },
    ],
    name: "__Signers_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "signers",
        type: "address[]",
      },
    ],
    name: "__Swapica_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "signers",
        type: "address[]",
      },
    ],
    name: "addSigners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes[]",
        name: "signatures",
        type: "bytes[]",
      },
    ],
    name: "cancelMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
    ],
    name: "cancelOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes[]",
        name: "signatures",
        type: "bytes[]",
      },
    ],
    name: "createMatch",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenToSell",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToSell",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenToBuy",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToBuy",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "destinationChain",
            type: "uint256",
          },
        ],
        internalType: "struct ISwapica.CreateOrderRequest",
        name: "request",
        type: "tuple",
      },
    ],
    name: "createOrder",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes[]",
        name: "signatures",
        type: "bytes[]",
      },
    ],
    name: "executeMatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes[]",
        name: "signatures",
        type: "bytes[]",
      },
    ],
    name: "executeOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getAllOrders",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "enum ISwapica.State",
                name: "state",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "matchId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "matchSwapica",
                type: "address",
              },
            ],
            internalType: "struct ISwapica.OrderStatus",
            name: "status",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenToSell",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToSell",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenToBuy",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToBuy",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "destinationChain",
            type: "uint256",
          },
        ],
        internalType: "struct ISwapica.Order[]",
        name: "allOrders",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllOrdersLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSigners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getUserMatches",
    outputs: [
      {
        components: [
          {
            internalType: "enum ISwapica.State",
            name: "state",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "matchId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "originOrderId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenToSell",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToSell",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "originChainId",
            type: "uint256",
          },
        ],
        internalType: "struct ISwapica.Match[]",
        name: "userMatches",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserMatchesLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getUserOrders",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "enum ISwapica.State",
                name: "state",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "matchId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "matchSwapica",
                type: "address",
              },
            ],
            internalType: "struct ISwapica.OrderStatus",
            name: "status",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenToSell",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToSell",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenToBuy",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amountToBuy",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "destinationChain",
            type: "uint256",
          },
        ],
        internalType: "struct ISwapica.Order[]",
        name: "userOrders",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserOrdersLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "signers",
        type: "address[]",
      },
    ],
    name: "removeSigners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_signaturesThreshold",
        type: "uint256",
      },
    ],
    name: "setSignaturesThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "signaturesThreshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export class Swapica__factory {
  static readonly abi = _abi;
  static createInterface(): SwapicaInterface {
    return new utils.Interface(_abi) as SwapicaInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Swapica {
    return new Contract(address, _abi, signerOrProvider) as Swapica;
  }
}
