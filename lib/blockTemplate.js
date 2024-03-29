var bignum = require('bignum');
var util = require('./util.js');
var merkle = require('./merkleTree.js');
var transactions = require('./transactions.js');
const algorithms = require('./algoProperties.js');
var bigInt = require("big-integer");
const { hex } = require('./algoProperties.js');
const store = require('store2');
const { NodeDiskStorage } = require('node-disk-storage')
const nds = new NodeDiskStorage()
/**
 * The BlockTemplate class holds a single job.
 * and provides several methods to validate and submit it to the daemon coin
**/
var BlockTemplate = module.exports = function BlockTemplate(jobId, rpcData, poolAddressScript, extraNoncePlaceholder, reward, txMessages, recipients){
  const { diff1 } = algorithms['sha256'];
    //private members
   
    //jobId  =  store('miningcandidate') ?  store('miningcandidate') : jobId;
    var submits = [];

    function getMerkleHashes(steps){
        return steps.map(function(step){
            return step.toString('hex');
        });
    }

    function getTransactionBuffers(txs){
        var txHashes = txs.map(function(tx){
            if (tx.txid !== undefined) {
                return util.uint256BufferFromHash(tx.txid);
            }
            return util.uint256BufferFromHash(tx.hash);
        });
        return [null].concat(txHashes);
    }

    function getVoteData(){
        if (!rpcData.masternode_payments) return new Buffer([]);

        return Buffer.concat(
            [util.varIntBuffer(rpcData.votes.length)].concat(
                rpcData.votes.map(function (vt) {
                    return new Buffer(vt, 'hex');
                })
            )
        );
    }

    //public members

    this.rpcData = rpcData;

 console.log('**************AAAAA****************', jobId);
        this.jobId = jobId;
        this.target = rpcData.target ? bignum(rpcData.target, 16) : util.bignumFromBitsHex(rpcData.nbits);
  
    console.log('******************************',this.rpcData);
    this.difficulty = parseFloat((diff1 / this.target.toNumber()).toFixed(9));


    this.prevHashReversed = util.reverseByteOrder(new Buffer(rpcData.previousblockhash, 'hex')).toString('hex');
     this.transactionData = Buffer.concat(rpcData.transactions.map(function(tx){
        return new Buffer(tx.data, 'hex');
    }));
    this.merkleTree = new merkle(getTransactionBuffers(rpcData.transactions));
     this.merkleBranch = getMerkleHashes(this.merkleTree.steps);
    this.generationTransaction = transactions.CreateGeneration(
        rpcData,
        poolAddressScript,
       extraNoncePlaceholder,
        reward,
       txMessages,
       recipients
     );

    this.serializeCoinbase = function(extraNonce1, extraNonce2){
        return Buffer.concat([
            this.generationTransaction[0],
            extraNonce1,
            extraNonce2,
            this.generationTransaction[1],
        ]);
    };


    //https://en.bitcoin.it/wiki/Protocol_specification#Block_Headers
    this.serializeHeader = function(merkleRoot, nTime, nonce){

        var header =  new Buffer(80);
        var position = 0;
        header.write(nonce, position, 4, 'hex');
        header.write(rpcData.bits, position += 4, 4, 'hex');
        header.write(nTime, position += 4, 4, 'hex');
        header.write(merkleRoot, position += 4, 32, 'hex');
        header.write(rpcData.previousblockhash, position += 32, 32, 'hex');
        header.writeUInt32BE(rpcData.version, position + 32);
        var header = util.reverseBuffer(header);
  
        return header;
    };
   
      
    this.serializeBlock = function(header, coinbase, nonce) {
      console.log("DTAAAAAAAAAAAA", this.rpcData)
      return Buffer.concat([
        header,
        util.varIntBuffer(this.rpcData.transactions.length + 1),
        coinbase,
        this.transactionData,
        Buffer.from([]),
      ]);
    
       const buff = Buffer.from(JSON.stringify({
            header,
            id: parseInt(store('candidatejobId'), 16),
            //Buffer.from(rpcData.previousblockhash, 'hex'),
            nonce: parseInt(nonce, 16),
            //util.varIntBuffer(this.rpcData.transactions.length + 1),
           coinbase:coinbase.toString('hex'),
           // this.transactionData,
           time: parseInt(this.rpcData.curtime, 16),
           //version: parseInt(this.rpcData.version, 16)
            //getVoteData()
            //POS coins require a zero byte appended to block which the daemon replaces with the signature
            //new Buffer([])
        }));
        console.log('bufff',buff.toString())
        nds.set('blockHex', JSON.stringify({
            //header,
            id: parseInt(store('candidatejobId'), 16),
            //Buffer.from(rpcData.previousblockhash, 'hex'),
            nonce: parseInt(nonce, 16),
            //util.varIntBuffer(this.rpcData.transactions.length + 1),
           coinbase:coinbase.toString('hex'),
           // this.transactionData,
           time: parseInt(this.rpcData.curtime, 16),
           //version: parseInt(this.rpcData.version, 16)
            //getVoteData()
            //POS coins require a zero byte appended to block which the daemon replaces with the signature
            //new Buffer([])
        })).then(res => console.log(res)).catch(err => console.log(err));  
        return buff;
    };

    this.registerSubmit = function(extraNonce1, extraNonce2, nTime, nonce){
        var submission = extraNonce1 + extraNonce2 + nTime + nonce;
        if (submits.indexOf(submission) === -1){
            submits.push(submission);
            return true;
        }
        return false;
    };

    this.getJobParams = function(){

        if (!this.jobParams){
            this.jobParams = [
                this.jobId,
                this.prevHashReversed,
                this.generationTransaction[0].toString('hex'),
                this.generationTransaction[1].toString('hex'),
                this.merkleBranch,
                util.packInt32BE(this.rpcData.version).toString('hex'),
                this.rpcData.bits,
                util.packUInt32BE(this.rpcData.curtime).toString('hex'),
                true
            ];
        }
        return this.jobParams;
    };
};
