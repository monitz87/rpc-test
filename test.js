const { WsProvider, ApiPromise } = require('@polkadot/api');
const { stringToU8a, u8aFixLength, hexToU8a } = require('@polkadot/util');

const provider = new WsProvider('wss://pmd.polymath.network');

(async function () {
  const api = await ApiPromise.create({
    provider,
    types: {
      IdentityId: 'H256',
      Ticker: '[u8; 12]',
      PosRatio: '(u32, u32)',
      DocumentName: 'Text',
      DocumentUri: 'Text',
      DocumentHash: 'Text',
      Document: {
        name: 'DocumentName',
        uri: 'DocumentUri',
        content_hash: 'DocumentHash',
      },
      AssetType: {
        _enum: {
          Equity: '',
          Debt: '',
          Commodity: '',
          StructuredProduct: '',
          Custom: 'Vec<u8>',
        },
      },
      IdentifierType: {
        _enum: {
          Isin: '',
          Cusip: '',
          Custom: 'Vec<u8>',
        },
      },
      TokenName: 'Text',
      AssetIdentifier: 'Text',
      FundingRoundName: 'Text',
      SecurityToken: {
        name: 'TokenName',
        total_supply: 'Balance',
        owner_did: 'IdentityId',
        divisible: 'bool',
        asset_type: 'AssetType',
        link_id: 'u64',
      },
      LinkedKeyInfo: {
        _enum: {
          Unique: 'IdentityId',
          Group: 'Vec<IdentityId>',
        },
      },
      AccountKey: '[u8;32]',
      Permission: {
        _enum: ['Full', 'Admin', 'Operator', 'SpendFunds'],
      },
      Link: {
        link_data: 'LinkData',
        expiry: 'Option<Moment>',
        link_id: 'u64',
      },
      LinkData: {
        _enum: {
          DocumentOwned: 'Document',
          TickerOwned: 'Ticker',
          TokenOwned: 'Ticker',
        },
      },
      SignatoryType: {
        _enum: ['External', 'Identity', 'MultiSig', 'Relayer'],
      },
      Signatory: {
        _enum: {
          Identity: 'IdentityId',
          AccountKey: 'AccountKey',
        },
      },
      SigningItem: {
        signer: 'Signatory',
        signer_type: 'SignatoryType',
        permissions: 'Vec<Permission>',
      },
      SigningItemWithAuth: {
        signing_item: 'SigningItem',
        auth_signature: 'Signature',
      },
      IdentityRole: {
        _enum: [
          'Issuer',
          'SimpleTokenIssuer',
          'Validator',
          'ClaimIssuer',
          'Investor',
          'NodeRunner',
          'PM',
          'CDDAMLClaimIssuer',
          'AccreditedInvestorClaimIssuer',
          'VerifiedIdentityClaimIssuer',
        ],
      },
      PreAuthorizedKeyInfo: {
        target_id: 'IdentityId',
        signing_item: 'SigningItem',
      },
      DidRecord: {
        roles: 'Vec<IdentityRole>',
        master_key: 'AccountKey',
        signing_items: 'Vec<SigningItem>',
      },
      JurisdictionName: 'Text',
      Scope: 'IdentityId',
      Claim: {
        _enum: {
          Accredited: 'Scope',
          Affiliate: 'Scope',
          BuyLockup: 'Scope',
          SellLockup: 'Scope',
          CustomerDueDiligence: '',
          KnowYourCustomer: 'Scope',
          Jurisdiction: '(JurisdictionName, Scope)',
          Whitelisted: 'Scope',
          Blacklisted: 'Scope',
          NoData: '',
        },
      },
      ClaimType: {
        _enum: {
          Accredited: '',
          Affiliate: '',
          BuyLockup: '',
          SellLockup: '',
          CustomerDueDiligence: '',
          KnowYourCustomer: '',
          Jurisdiction: '',
          Whitelisted: '',
          Blacklisted: '',
          NoType: '',
        },
      },
      IdentityClaim: {
        claim_issuer: 'IdentityId',
        issuance_date: 'Moment',
        last_update_date: 'Moment',
        expiry: 'Option<Moment>',
        claim: 'Claim',
      },
      IdentityClaimKey: {
        id: 'IdentityId',
        claim_type: 'ClaimType',
      },
      AssetTransferRule: {
        sender_rules: 'Vec<Rule>',
        receiver_rules: 'Vec<Rule>',
        rule_id: 'u32',
      },
      RuleType: {
        _enum: {
          IsPresent: 'Claim',
          IsAbsent: 'Claim',
          IsAnyOf: 'Vec<Claim>',
          IsNoneOf: 'Vec<Claim>',
        },
      },
      Rule: {
        rule_type: 'RuleType',
        issuers: 'Vec<IdentityId>',
      },
      STO: {
        beneficiary_did: 'IdentityId',
        cap: 'Balance',
        sold: 'Balance',
        rate: 'u64',
        start_date: 'Moment',
        end_date: 'Moment',
        active: 'bool',
      },
      Investment: {
        investor_did: 'IdentityId',
        amount_paid: 'Balance',
        tokens_purchased: 'Balance',
        last_purchase_date: 'Moment',
      },
      SimpleTokenRecord: {
        ticker: 'Ticker',
        total_supply: 'Balance',
        owner_did: 'IdentityId',
      },
      FeeOf: 'Balance',
      Dividend: {
        amount: 'Balance',
        active: 'bool',
        maturates_at: 'Option<u64>',
        expires_at: 'Option<u64>',
        payout_currency: 'Option<Ticker>',
        checkpoint_id: 'u64',
      },
      TargetIdAuthorization: {
        target_id: 'IdentityId',
        nonce: 'u64',
        expires_at: 'Moment',
      },
      TickerRegistration: {
        owner: 'IdentityId',
        expiry: 'Option<Moment>',
        link_id: 'u64',
      },
      TickerRegistrationConfig: {
        max_ticker_length: 'u8',
        registration_length: 'Option<Moment>',
      },
      SignData: {
        custodian_did: 'IdentityId',
        holder_did: 'IdentityId',
        ticker: 'Ticker',
        value: 'Balance',
        nonce: 'u16',
      },
      MotionTitle: 'Text',
      MotionInfoLink: 'Text',
      Motion: {
        title: 'MotionTitle',
        info_link: 'MotionInfoLink',
        choices: 'Vec<MotionTitle>',
      },
      Ballot: {
        checkpoint_id: 'u64',
        voting_start: 'Moment',
        voting_end: 'Moment',
        motions: 'Vec<Motion>',
      },
      Url: 'Text',
      MipDescription: 'Text',
      MipsMetadata: {
        proposer: 'AccountKey',
        index: 'u32',
        end: 'u32',
        proposal_hash: 'Hash',
        url: 'Option<Url>',
        description: 'Option<MipDescription>',
      },
      PolymeshVotes: {
        index: 'u32',
        ayes: 'Vec<(IdentityId, Balance)>',
        nays: 'Vec<(IdentityId, Balance)>',
      },
      MipsIndex: 'u32',
      MipsPriority: {
        _enum: ['High', 'Normal'],
      },
      MIP: {
        index: 'MipsIndex',
        proposal: 'Call',
      },
      PolymeshReferendumInfo: {
        index: 'MipsIndex',
        priority: 'MipsPriority',
        proposal_hash: 'Hash',
      },
      TickerTransferApproval: {
        authorized_by: 'IdentityId',
        next_ticker: 'Option<Ticker>',
        previous_ticker: 'Option<Ticker>',
      },
      OffChainSignature: 'H512',
      PermissionedValidator: {
        compliance: 'Compliance',
      },
      Authorization: {
        authorization_data: 'AuthorizationData',
        authorized_by: 'Signatory',
        expiry: 'Option<Moment>',
        auth_id: 'u64',
      },
      AuthorizationData: {
        _enum: {
          AttestMasterKeyRotation: 'IdentityId',
          RotateMasterKey: 'IdentityId',
          TransferTicker: 'Ticker',
          AddMultiSigSigner: '',
          TransferTokenOwnership: 'Ticker',
          JoinIdentity: 'IdentityId',
          Custom: 'Vec<u8>',
          NoData: '',
        },
      },
      AuthIdentifier: {
        signatory: 'Signatory',
        auth_id: 'u64',
      },
      Compliance: {
        _enum: ['Pending', 'Active'],
      },
      SmartExtensionType: {
        _enum: {
          TransferManager: '',
          Offerings: '',
          Custom: 'Vec<u8>',
        },
      },
      SmartExtensionName: 'Text',
      SmartExtension: {
        extension_type: 'SmartExtensionType',
        extension_name: 'SmartExtensionName',
        extension_id: 'IdentityId',
        is_archive: 'bool',
      },
      ProportionMatch: {
        _enum: ['AtLeast', 'MoreThan'],
      },
      AuthorizationNonce: 'u64',
      Counter: 'u64',
      Commission: {
        _enum: {
          Individual: '',
          Global: 'u32',
        },
      },
      RestrictionResult: {
        _enum: ['Valid', 'Invalid', 'ForceValid'],
      },
      Memo: '[u8;32]',
      IssueRecipient: {
        _enum: {
          Account: 'AccountKey',
          Identity: 'IdentityId',
        },
      },
      BridgeTx: {
        nonce: 'u64',
        recipient: 'IssueRecipient',
        value: 'u128',
        tx_hash: 'H256',
      },
      PendingTx: {
        did: 'IdentityId',
        bridge_tx: 'BridgeTx',
      },
      OfflineSlashingParams: {
        max_offline_percent: 'u32',
        constant: 'u32',
        max_slash_percent: 'u32',
      },
      AssetTransferRules: {
        is_paused: 'bool',
        rules: 'Vec<AssetTransferRule>',
      },
      Claim1stKey: {
        target: 'IdentityId',
        claim_type: 'ClaimType',
      },
      Claim2ndKey: {
        issuer: 'IdentityId',
        scope: 'Option<Scope>',
      },
      BatchAddClaimItem: {
        target: 'IdentityId',
        claim: 'Claim',
        expiry: 'Option<u64>',
      },
      BatchRevokeClaimItem: {
        target: 'IdentityId',
        claim: 'Claim',
      },
      InactiveMember: {
        id: 'IdentityId',
        deactivated_at: 'Moment',
        expiry: 'Option<Moment>',
      },
      ProtocolOp: {
        _enum: [
          'AssetRegisterTicker',
          'AssetIssue',
          'AssetAddDocument',
          'AssetCreateToken',
          'DividendNew',
          'GeneralTmAddActiveRule',
          'IdentityRegisterDid',
          'IdentityCddRegisterDid',
          'IdentityAddClaim',
          'IdentitySetMasterKey',
          'IdentityAddSigningItem',
          'MipsPropose',
          'VotingAddBallot',
        ],
      },
    },
    rpc: {
      identity: {
        getAssetDid: {
          description: 'function is used to query the given ticker DID',
          params: [
            {
              name: 'blockHash',
              type: 'Hash',
              isOptional: true,
            },
            {
              name: 'ticker',
              type: '[u8; 12]',
              isOptional: false,
            },
          ],
          type: 'IdentityId',
        },
      },
    },
  });

  const ticker = 'someTicker';

  try {
    const res = await api.rpc.identity.getAssetDid(ticker);
    console.log('SUCCESS!', res);
  } catch (err) {
    console.log('\n\nPlain string fails\n\n', err, '\n\n');
  }

  try {
    const res = await api.rpc.identity.getAssetDid(api.createType('Ticker', ticker));
    console.log('SUCCESS!', res);
  } catch (err) {
    console.log('\n\nTicker Codec fails\n\n', err, '\n\n');
  }

  try {
    const res = await api.rpc.identity.getAssetDid(api.createType('Ticker', ticker).toU8a());
    console.log('SUCCESS!', res);
  } catch (err) {
    console.log('\n\nTicker Codec .toU8a fails\n\n', err, '\n\n');
  }

  try {
    const res = await api.rpc.identity.getAssetDid(stringToU8a(ticker));
    console.log('SUCCESS!', res);
  } catch (err) {
    console.log('\n\nstringToU8a fails\n\n', err, '\n\n');
  }

  try {
    const res = await api.rpc.identity.getAssetDid(u8aFixLength(stringToU8a(ticker), 96, true));
    console.log('SUCCESS!', res);
  } catch (err) {
    console.log('\n\nu8aFixLength fails\n\n', err, '\n\n');
  }
})();


