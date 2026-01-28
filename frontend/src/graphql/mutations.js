import { gql } from "@apollo/client";

export const SUBMIT_REIMBURSEMENT_MUTATION = gql`
  mutation SubmitReimbursement(
    $showId: ID!
    $photoUrl: String!
    $notes: String
    $paymentMethod: String!
    $amount: Decimal!
  ) {
    submitReimbursement(
      showId: $showId
      photoUrl: $photoUrl
      notes: $notes
      paymentMethod: $paymentMethod
      amount: $amount
    ) {
      success
      errors
      reimbursement {
        id
        showName
        amount
        paymentMethod
        photoUrl
      }
    }
  }
`;
