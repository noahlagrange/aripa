import { gql } from '@apollo/client';
import exp from 'constants';

export const GET_USERS = gql`
  query {
    users {
      id
      name
      email
      phone
      boats {
        id
        name
        type
        taxes {
          id
          price
          date
        }
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $phone: String!) {
    createUser(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
      boats {
        id
        name
        type
        taxes {
          id
          price
          date
        }
      }
    }
  }
`;

export const ADD_BOAT_TO_USER = gql`
  mutation AddBoatToUser($userId: Int!, $boatId: Int!) {
    addBoatToUser(userId: $userId, boatId: $boatId) {
      id
      name
      boats {
        id
        name
        type
        taxes {
          id
          price
          date
        }
      }
    }
  }
`;

export const REMOVE_BOAT_FROM_USER = gql`
  mutation RemoveBoatFromUser($userId: Int!, $boatId: Int!) {
    removeBoatFromUser(userId: $userId, boatId: $boatId) {
      id
      name
      boats {
        id
        name
        type
      }
    }
  }
`;


export const GET_BOATS = gql`
  query {
    boats {
      id
      name
      type
      owner
      taxes {
        id
        price
        date
      }
    }
  }
`;

export const CREATE_BOAT = gql`
  mutation CreateBoat($name: String!, $type: String!, $owner: Int!) {
    createBoat(name: $name, type: $type, owner: $owner) {
      id
      name
      type
      owner
    }
  }
`;

export const GET_USER_INFO = gql`
  query GetUserInfo($userId: Int!) {
    user(id: $userId) {
      id
      name
      email
      phone
      boats {
        id
        name
        type
        taxes {
          id
          price
          date
        }
      }
    }
  }
`;

export const GET_BOAT_INFO = gql`
  query Boat($boatId: Int!) {
    boat(id: $boatId) {
      id
      name
      type
      owner
      taxes {
        id
        price
        date
      }
    }
  }
`;

export const CREATE_TAX = gql`
  mutation CreateTax($price: Int!, $boatId: Int!, $date: String!) {
    createTax(price: $price, boatId: $boatId, date: $date) {
      id
      price
      date
    }
  }
`;

export const ADD_TAX_TO_BOAT = gql`
  mutation AddTaxToBoat($boatId: Int!, $taxId: Int!) {
    addTaxToBoat(boatId: $boatId, taxId: $taxId) {
      id
      name
      taxes {
        id
        price
        date
      }
    }
  }
`;

export const GET_ALL_USER_TAXES = gql`
  query GetAllUserTaxes($userId: Int!) {
    findUserBoatTaxes(userId: $userId) {
      id
      price
      date
      boatId
    }
  }
`;

export const GET_BOAT_TAXES = gql`
  query BoatTaxes($boatId: Int!) {
    BoatTaxes(id: $boatId) {
      id
      price
      date
    }
  }
`;

export const DELETE_TAX = gql`
  mutation deleteTaxById($id: Int!) {
    deleteTaxById(id: $id) {
      id
    }
  }
`;

export const DELETE_BOAT = gql`
  mutation deleteBoatById($id: Int!) {
    deleteBoatById(id: $id) {
      id
    }
  }
`; 

export const UPDATE_USER = gql`
  mutation updateUser($id: Int!, $name: String!, $email: String!, $phone: String!) {
    updateUser(id: $id, name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

export const UPDATE_BOAT = gql`
  mutation updateBoat($id: Int!, $name: String!, $type: String!) {
    updateBoat(id: $id, name: $name, type: $type) {
      id
      name
      type
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($name: String!, $password: String!) {
    createAccount(name: $name, password: $password) {
      id
      name
    }
  }
`;

export const VERIFY_ACCOUNT = gql`
  mutation VerifyAccount($name: String!, $password: String!) {
    verifyAccount(name: $name, password: $password)
  }
`;