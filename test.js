const { WsProvider, ApiPromise, Keyring } = require('@polkadot/api');
const { stringToU8a, u8aFixLength, hexToU8a, u8aConcat, u8aToHex, u8aToString } = require('@polkadot/util');
const { blake2AsHex } = require('@polkadot/util-crypto');

const provider = new WsProvider('ws://127.0.0.1:9944');

(async function () {
  const api = await ApiPromise.create({
    provider,
    "types": {
        "IdentityId":"[u8; 32]",
        "Ticker": "[u8; 12]",
        "PosRatio": "(u32, u32)",
        "DocumentName": "Text",
        "DocumentUri": "Text",
        "DocumentHash": "Text",
        "Document": {
            "name": "DocumentName",
            "uri": "DocumentUri",
            "content_hash": "DocumentHash"
        },
        "AssetType": {
            "_enum": {
                "EquityCommon": "",
                "EquityPreferred": "",
                "Commodity": "",
                "FixedIncome": "",
                "REIT": "",
                "Fund": "",
                "RevenueShareAgreement": "",
                "StructuredProduct": "",
                "Derivative": "",
                "Custom": "Vec<u8>"
            }
        },
        "IdentifierType": {
            "_enum": {
                "Cins": "",
                "Cusip": "",
                "Isin": ""
            }
        },
        "AssetName": "Text",
        "AssetIdentifier": "Text",
        "FundingRoundName": "Text",
        "SecurityToken": {
            "name": "AssetName",
            "total_supply": "Balance",
            "owner_did": "IdentityId",
            "divisible": "bool",
            "asset_type": "AssetType",
            "link_id": "u64"
        },
        "LinkedKeyInfo": {
            "_enum": {
                "Unique": "IdentityId",
                "Group": "Vec<IdentityId>"
            }
        },
        "AccountKey": "[u8;32]",
        "Permission": {
            "_enum": [
                "Full",
                "Admin",
                "Operator",
                "SpendFunds"
            ]
        },
        "Link": {
            "link_data": "LinkData",
            "expiry": "Option<Moment>",
            "link_id": "u64"
        },
        "LinkData": {
            "_enum": {
                "DocumentOwned": "Document",
                "TickerOwned": "Ticker",
                "AssetOwned": "Ticker"
            }
        },
        "SignatoryType": {
            "_enum": [
                "External",
                "Identity",
                "MultiSig",
                "Relayer"
            ]
        },
        "Signatory":{
            "_enum": {
                "Identity": "IdentityId",
                "AccountKey": "AccountKey"
            }
        },
        "SigningItem": {
            "signer": "Signatory",
            "signer_type": "SignatoryType",
            "permissions": "Vec<Permission>"
        },
        "SigningItemWithAuth":{
            "signing_item": "SigningItem",
            "auth_signature": "Signature"
        },
        "IdentityRole": {
            "_enum": [
                "Issuer",
                "SimpleTokenIssuer",
                "Validator",
                "ClaimIssuer",
                "Investor",
                "NodeRunner",
                "PM",
                "CDDAMLClaimIssuer",
                "AccreditedInvestorClaimIssuer",
                "VerifiedIdentityClaimIssuer"
            ]
        },
        "PreAuthorizedKeyInfo": {
            "target_id": "IdentityId",
            "signing_item": "SigningItem"
        },
        "DidRecord": {
            "roles": "Vec<IdentityRole>",
            "master_key": "AccountKey",
            "signing_items": "Vec<SigningItem>"
        },
        "JurisdictionName": "Text",
        "Scope": "IdentityId",
        "Claim": {
            "_enum": {
                "Accredited": "Scope",
                "Affiliate": "Scope",
                "BuyLockup": "Scope",
                "SellLockup": "Scope",
                "CustomerDueDiligence": "",
                "KnowYourCustomer": "Scope",
                "Jurisdiction": "(JurisdictionName, Scope)",
                "Whitelisted": "Scope",
                "Blacklisted": "Scope",
                "NoData": ""
            }
        },
        "ClaimType": {
            "_enum": {
                "Accredited": "",
                "Affiliate": "",
                "BuyLockup": "",
                "SellLockup": "",
                "CustomerDueDiligence": "",
                "KnowYourCustomer": "",
                "Jurisdiction": "",
                "Whitelisted": "",
                "Blacklisted": "",
                "NoType": ""
            }
        },
        "IdentityClaim": {
            "claim_issuer": "IdentityId",
            "issuance_date": "Moment",
            "last_update_date": "Moment",
            "expiry": "Option<Moment>",
            "claim": "Claim"
        },
        "IdentityClaimKey": {
            "id": "IdentityId",
            "claim_type": "ClaimType"
        },
        "AssetTransferRule": {
            "sender_rules": "Vec<Rule>",
            "receiver_rules":"Vec<Rule>",
            "rule_id": "u32"
        },
        "RuleType": {
            "_enum": {
                "IsPresent" : "Claim",
                "IsAbsent": "Claim",
                "IsAnyOf": "Vec<Claim>",
                "IsNoneOf": "Vec<Claim>"
            }
        },
        "Rule": {
            "rule_type": "RuleType",
            "issuers": "Vec<IdentityId>"
        },
        "STO": {
            "beneficiary_did": "IdentityId",
            "cap": "Balance",
            "sold": "Balance",
            "rate": "u64",
            "start_date": "Moment",
            "end_date": "Moment",
            "active": "bool"
        },
        "Investment": {
            "investor_did": "IdentityId",
            "amount_paid": "Balance",
            "assets_purchased": "Balance",
            "last_purchase_date": "Moment"
        },
        "SimpleTokenRecord": {
            "ticker": "Ticker",
            "total_supply": "Balance",
            "owner_did": "IdentityId"
        },
        "FeeOf": "Balance",
        "Dividend": {
            "amount": "Balance",
            "active": "bool",
            "matures_at": "Option<Moment>",
            "expires_at": "Option<Moment>",
            "payout_currency": "Option<Ticker>",
            "checkpoint_id": "u64"
        },
        "TargetIdAuthorization": {
            "target_id": "IdentityId",
            "nonce": "u64",
            "expires_at": "Moment"
        },
        "TickerRegistration": {
            "owner": "IdentityId",
            "expiry": "Option<Moment>",
            "link_id": "u64"
        },
        "TickerRegistrationConfig": {
            "max_ticker_length": "u8",
            "registration_length": "Option<Moment>"
        },
        "SignData": {
            "custodian_did": "IdentityId",
            "holder_did": "IdentityId",
            "ticker": "Ticker",
            "value": "Balance",
            "nonce": "u16"
        },
        "MotionTitle": "Text",
        "MotionInfoLink": "Text",
        "Motion": {
            "title": "MotionTitle",
            "info_link": "MotionInfoLink",
            "choices": "Vec<MotionTitle>"
        },
        "Ballot": {
            "checkpoint_id": "u64",
            "voting_start": "Moment",
            "voting_end": "Moment",
            "motions": "Vec<Motion>"
        },
        "Url": "Text",
        "PipDescription": "Text",
        "PipsMetadata": {
            "proposer": "AccountKey",
            "id": "PipId",
            "end": "u32",
            "url": "Option<Url>",
            "description": "Option<PipDescription>",
            "cool_off_until": "u32",
            "beneficiaries": "Vec<Beneficiary>"
        },
        "Beneficiary": {
            "id": "IdentityId",
            "amount": "Balance"
        },
        "DepositInfo": {
            "owner": "AccountKey",
            "amount": "Balance"
        },
        "PolymeshVotes": {
            "index": "u32",
            "ayes": "Vec<(IdentityId, Balance)>",
            "nays": "Vec<(IdentityId, Balance)>"
        },
        "PipId": "u32",
        "ProposalState": {
            "_enum": [
                "Pending",
                "Cancelled",
                "Killed",
                "Rejected",
                "Referendum"
            ]
        },
        "ReferendumState": {
            "_enum": [
                "Pending",
                "Scheduled",
                "Rejected",
                "Failed",
                "Executed"
            ]
        },
        "ReferendumType": {
            "_enum": [
                "FastTracked",
                "Emergency",
                "Community"
            ]
        },
        "Pip": {
            "id": "PipId",
            "proposal":"Call",
            "state":"ProposalState"
        },
        "ProposalData" : {
            "_enum": {
                "Hash": "Hash",
                "Proposal": "Vec<u8>"
            }
        },
        "Referendum": {
            "id": "PipId",
            "state": "ReferendumState",
            "referendum_type": "ReferendumType",
            "enactment_period": "u32"
        },
        "TickerTransferApproval": {
            "authorized_by": "IdentityId",
            "next_ticker": "Option<Ticker>",
            "previous_ticker": "Option<Ticker>"
        },
        "OffChainSignature": "H512",
        "PermissionedValidator": {
            "compliance": "Compliance"
        },
        "Authorization": {
            "authorization_data": "AuthorizationData",
            "authorized_by": "Signatory",
            "expiry": "Option<Moment>",
            "auth_id": "u64"
        },
        "AuthorizationData": {
            "_enum": {
                "AttestMasterKeyRotation": "IdentityId",
                "RotateMasterKey": "IdentityId",
                "TransferTicker": "Ticker",
                "AddMultiSigSigner": "",
                "TransferAssetOwnership": "Ticker",
                "JoinIdentity": "IdentityId",
                "Custom": "Vec<u8>",
                "NoData": ""
            }
        },
        "AuthIdentifier": {
            "signatory": "Signatory",
            "auth_id": "u64"
        },
        "Compliance": {
            "_enum": [
                "Pending",
                "Active"
            ]
        },
        "SmartExtensionType": {
            "_enum": {
                "TransferManager": "",
                "Offerings": "",
                "Custom": "Vec<u8>"
            }
        },
        "SmartExtensionName": "Text",
        "SmartExtension": {
            "extension_type": "SmartExtensionType",
            "extension_name": "SmartExtensionName",
            "extension_id": "IdentityId",
            "is_archive": "bool"
        },
        "ProportionMatch": {
            "_enum": [
                "AtLeast",
                "MoreThan"
            ]
        },
        "AuthorizationNonce": "u64",
        "Counter": "u64",
        "Commission": {
            "_enum": {
                "Individual": "",
                "Global": "u32"
            }
        },
        "RestrictionResult": {
            "_enum": [
                "Valid",
                "Invalid",
                "ForceValid"
            ]
        },
        "Memo": "[u8;32]",
        "IssueRecipient": {
            "_enum": {
                "Account": "AccountKey",
                "Identity": "IdentityId"
            }
        },
        "BridgeTx": {
            "nonce": "u32",
            "recipient": "AccountId",
            "value": "Balance",
            "tx_hash": "H256"
        },
        "PendingTx": {
            "did": "IdentityId",
            "bridge_tx": "BridgeTx"
        },
        "OfflineSlashingParams": {
            "max_offline_percent": "u32",
            "constant": "u32",
            "max_slash_percent": "u32"
        },
        "AssetTransferRules": {
            "is_paused": "bool",
            "rules": "Vec<AssetTransferRule>"
        },
        "Claim1stKey": {
            "target": "IdentityId",
            "claim_type": "ClaimType"
        },
        "Claim2ndKey": {
            "issuer": "IdentityId",
            "scope": "Option<Scope>"
        },
        "BatchAddClaimItem": {
            "target": "IdentityId",
            "claim": "Claim",
            "expiry": "Option<Moment>"
        },
        "BatchRevokeClaimItem": {
            "target": "IdentityId",
            "claim": "Claim"
        },
        "InactiveMember" : {
            "id": "IdentityId",
            "deactivated_at": "Moment",
            "expiry": "Option<Moment>"
        },
        "VotingResult" : {
            "ayes_count": "u32",
            "ayes_stake": "Balance",
            "nays_count": "u32",
            "nays_stake": "Balance"
        },
        "ProtocolOp": {
            "_enum": [
                "AssetRegisterTicker",
                "AssetIssue",
                "AssetAddDocuments",
                "AssetCreateAsset",
                "DividendNew",
                "ComplianceManagerAddActiveRule",
                "IdentityRegisterDid",
                "IdentityCddRegisterDid",
                "IdentityAddClaim",
                "IdentitySetMasterKey",
                "IdentityAddSigningItemsWithAuthorization",
                "PipsPropose",
                "VotingAddBallot"
            ]
        },
        "CddStatus": {
            "_enum": {
                "Ok": "IdentityId",
                "Err": "Vec<u8>"
            }
        },
        "AssetDidResult": {
            "_enum": {
                "Ok": "IdentityId",
                "Err": "Vec<u8>"
            }
        },
        "DidRecordsSuccess": {
            "master_key" : "AccountKey",
            "signing_items": "Vec<SigningItem>"
        },
        "DidRecords": {
            "_enum": {
                "Success": "DidRecordsSuccess",
                "IdNotFound": "Vec<u8>"
            }
        },
        "CappedVoteCountSuccess": {
            "ayes": "u64",
            "nays": "u64"
        },
        "CappedVoteCount": {
            "_enum": {
                "Success": "CappedVoteCountSuccess",
                "ProposalNotFound": "Vec<u8>"
            }
        },
        "Weight": "u32",
        "BridgeTxDetail": {
            "amount": "Balance",
            "status": "BridgeTxStatus",
            "execution_block": "BlockNumber",
            "tx_hash": "H256"
        },
        "BridgeTxStatus": {
            "_enum": {
                "Absent": "",
                "Pending": "u8",
                "Frozen": "",
                "Timelocked": "",
                "Handled": ""
            }
        },
        "CappedFee": "u64",
        "CanTransferResult": {
            "_enum": {
                "Ok": "u8",
                "Err": "Vec<u8>"
            }
        },
        "LinkType": {
            "_enum": {
                "DocumentOwnership": "",
                "TickerOwnership": "",
                "AssetOwnership": "",
                "NoData":""
            }
        }
    },
    "rpc": {
        "identity": {
            "isIdentityHasValidCdd" : {
                "description": "use to tell whether the given did has valid cdd claim or not",
                "params": [                    
                    {
                        "name": "did",
                        "type": "IdentityId",
                        "isOptional": false
                    },
                    {
                        "name": "buffer_time",
                        "type": "u64",
                        "isOptional": true
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "CddStatus"
            },
            "getAssetDid": {
                "description": "function is used to query the given ticker DID",
                "params": [                    
                    {
                        "name": "ticker",
                        "type": "Ticker",
                        "isOptional": false
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "AssetDidResult"
            },
            "getDidRecords": {
                "description": "Used to get the did record values for a given DID",
                "params": [                    
                    {
                        "name": "did",
                        "type": "IdentityId",
                        "isOptional": false
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "DidRecords"
            },
            "getFilteredLinks": {
                "description": "Retrieve links data for a given signatory and filtered using the given Link type",
                "params": [
                    {
                        "name": "signatory",
                        "type": "Signatory",
                        "isOptional": false
                    },
                    {
                        "name": "allow_expired",
                        "type": "bool",
                        "isOptional": false
                    },
                    {
                        "name": "link_type",
                        "type": "LinkType",
                        "isOptional": true
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "Vec<Link>"
            }
        },
        "pips":{
            "getVotes": {
                "description": "Summary of votes of a proposal given by index",
                "params": [                    
                    {
                        "name": "index",
                        "type": "u32",
                        "isOptional": false
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "CappedVoteCount"
            },
            "proposedBy": {
                "description": "Retrieves proposal indices started by address",
                "params": [                    
                    {
                        "name": "address",
                        "type": "AccountId",
                        "isOptional": false
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "Vec<u32>"
            },
            "votedOn": {
                "description": "Retrieves proposal address indices voted on",
                "params": [                    
                    {
                        "name": "address",
                        "type": "AccountId",
                        "isOptional": false
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "Vec<u32>"
            }
        },
        "protocolFee": {
            "computeFee": {
                "description": "Gets the fee of a chargeable extrinsic operation",
                "params": [                    
                    {
                        "name": "op",
                        "type": "ProtocolOp",
                        "isOptional": false
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "CappedFee"
            }
        },
        "staking": {
            "getCurve": {
                "description": "Retrieves curves parameters",
                "params": [
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true
                    }
                ],
                "type": "Vec<(Perbill, Perbill)>"
            }
        },
        "asset" : {
            "canTransfer": {
                "description": "Checks whether a transaction with given parameters can take place or not",
                "params": [                    
                    {
                        "name": "sender",
                        "type": "AccountId",
                        "isOptional": false   
                    },
                    {
                        "name": "ticker",
                        "type": "Ticker",
                        "isOptional": false   
                    },
                    {
                        "name": "from_did",
                        "type": "IdentityId",
                        "isOptional": true   
                    },
                    {
                        "name": "to_did",
                        "type": "IdentityId",
                        "isOptional": true   
                    },
                    {
                        "name": "value",
                        "type": "Balance",
                        "isOptional": false   
                    },
                    {
                        "name": "blockHash",
                        "type": "Hash",
                        "isOptional": true   
                    }
                ],
                "type": "CanTransferResult"
            }
        }
    }  
  });

  try {
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri('//Alice');
    const { publicKey } = pair;
    const did = (await api.query.identity.keyToIdentityIds(publicKey)).unwrap().asUnique.toString();

    console.log('DID is', did.toString());

    let nonce = 0;
    await api.tx.asset.createAsset('A_DEMO_1', 'A_DEMO_1', 3000000000, true, 'EquityCommon', [], null).signAndSend(pair, {
      nonce: nonce++
    });
    await api.tx.asset.createAsset('A_DEMO_2', 'A_DEMO_2', 3000000000, true, 'EquityCommon', [], null).signAndSend(pair, {
      nonce: nonce++
    });
    await api.tx.asset.registerTicker('A_DEMO_3').signAndSend(pair, {
      nonce: nonce++
    });
    await api.tx.asset.registerTicker('A_DEMO_4').signAndSend(pair, {
      nonce: nonce++
    });

    await new Promise((resolve, reject) => {
      setTimeout(resolve, 5000);
    });

    const res1 = await api.rpc.identity.getFilteredLinks({ Identity: did }, true);    
    
    console.log('\nResponse 1\n=====');
    res1.forEach(link => {
      console.log('Link ID:', link.link_id.toNumber());
      console.log('Is document:', link.link_data.isDocumentOwned);
    });
    console.log('');
  
    const res2 = await api.rpc.identity.getFilteredLinks({ Identity: did }, true, 'TickerOwnership');    

    console.log('\nResponse 2\n=====');
    res2.forEach(link => {
      console.log('Link ID:', link.link_id.toNumber());
      console.log('Is document:', link.link_data.isDocumentOwned);
    });

    const res3 = await api.rpc.identity.getFilteredLinks({ Identity: did }, true, 'AssetOwnership');

    console.log('\nResponse 3\n=====')
    res3.forEach(link => {
      console.log('Link ID:', link.link_id.toNumber());
      console.log('Is document:', link.link_data.isDocumentOwned);
    });    
  } catch (err) {
    console.log(err.message);
  }
})();