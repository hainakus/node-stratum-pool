var bignum = require('bignum');
var multiHashing = require('multi-hashing');
var util = require('./util.js');

var diff1 = global.diff1 = 0x00000000ffff0000000000000000000000000000000000000000000000000000;

var algos = module.exports = global.algos = {
    sha256: {
        //Uncomment diff if you want to use hardcoded truncated diff
        diff1: '00000000ffff0000000000000000000000000000000000000000000000000000',
        hash: function(){
            return function(){
                return util.sha256d.apply(this, arguments);
            }
        }
    },
    'scrypt': {
        //Uncomment diff if you want to use hardcoded truncated diff
        //diff: '0000ffff00000000000000000000000000000000000000000000000000000000',
        multiplier: Math.pow(2, 16),
        hash: function(coinConfig){
            var nValue = coinConfig.nValue || 1024;
            var rValue = coinConfig.rValue || 1;
            return function(data){
                return multiHashing.scrypt(data,nValue,rValue);
            }
        }
    },
    'scrypt-og': {
        //Aiden settings
        //Uncomment diff if you want to use hardcoded truncated diff
        //diff: '0000ffff00000000000000000000000000000000000000000000000000000000',
        multiplier: Math.pow(2, 16),
        hash: function(coinConfig){
            var nValue = coinConfig.nValue || 64;
            var rValue = coinConfig.rValue || 1;
            return function(data){
                return multiHashing.scrypt(data,nValue,rValue);
            }
        }
    },
    'scrypt-jane': {
        multiplier: Math.pow(2, 16),
        hash: function(coinConfig){
            var nTimestamp = coinConfig.chainStartTime || 1367991200;
            var nMin = coinConfig.nMin || 4;
            var nMax = coinConfig.nMax || 30;
            return function(data, nTime){
                return multiHashing.scryptjane(data, nTime, nTimestamp, nMin, nMax);
            }
        }
    },
    'scrypt-n': {
        multiplier: Math.pow(2, 16),
        hash: function(coinConfig){

            var timeTable = coinConfig.timeTable || {
                "2048": 1389306217, "4096": 1456415081, "8192": 1506746729, "16384": 1557078377, "32768": 1657741673,
                "65536": 1859068265, "131072": 2060394857, "262144": 1722307603, "524288": 1769642992
            };

            var nFactor = (function(){
                var n = Object.keys(timeTable).sort().reverse().filter(function(nKey){
                    return Date.now() / 1000 > timeTable[nKey];
                })[0];

                var nInt = parseInt(n);
                return Math.log(nInt) / Math.log(2);
            })();

            return function(data) {
                return multiHashing.scryptn(data, nFactor);
            }
        }
    },
    sha1: {
        hash: function(){
            return function(){
                return multiHashing.sha1.apply(this, arguments);
            }
        }
    },
    x11: {
        hash: function(){
            return function(){
                return multiHashing.x11.apply(this, arguments);
            }
        }
    },
    x12: {
        hash: function(){
            return function(){
                return multiHashing.x12.apply(this, arguments);
            }
        }
    },
    x13: {
        hash: function(){
            return function(){
                return multiHashing.x13.apply(this, arguments);
            }
        }
    },
    x14: {
        hash: function(){
            return function(){
                return multiHashing.x14.apply(this, arguments);
            }
        }
    },
    x15: {
        hash: function(){
            return function(){
                return multiHashing.x15.apply(this, arguments);
            }
        }
    },
    x16r: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.x16r.apply(this, arguments);
            }
        }
    },
    x16s: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.x16s.apply(this, arguments);
            }
        }
    },
    x16rt: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.x16rt.apply(this, arguments);
            }
        }
    },
    x17: {
        hash: function(){
            return function(){
                return multiHashing.x17.apply(this, arguments);
            }
        }
    },
    x21s: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.x21s.apply(this, arguments);
            }
        }
    },
    x22i: {
        hash: function(){
            return function(){
                return multiHashing.x22i.apply(this, arguments);
            }
        }
    },
    x25x: {
        hash: function(){
            return function(){
                return multiHashing.x25x.apply(this, arguments);
            }
        }
    },
    argon2d: {
        hash: function(){
            return function(){
                return multiHashing.argon2d.apply(this, arguments);
            }
        }
    },
    argon2i: {
        hash: function(){
            return function(){
                return multiHashing.argon2i.apply(this, arguments);
            }
        }
    },
    cpu23r: {
        hash: function(){
            return function(){
                return multiHashing.cpu23r.apply(this, arguments);
            }
        }
    },
    honeycomb: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.honeycomb.apply(this, arguments);
            }
        }
    },
    nist5: {
        hash: function(){
            return function(){
                return multiHashing.nist5.apply(this, arguments);
            }
        }
    },
    hmq1725: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.hmq1725.apply(this, arguments);
            }
        }
    },
    keccakc: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.keccakc.apply(this, arguments);
            }
        }
    },
    xevan: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.xevan.apply(this, arguments);
            }
        }
    },
    skunkhash: {
        hash: function(){
            return function(){
                return multiHashing.skunkhash.apply(this, arguments);
            }
        }
    },
    timetravel10: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.timetravel10.apply(this, arguments);
            }
        }
    },
    lyra2re: {
        multiplier: Math.pow(2, 7),
        hash: function(){
            return function(){
                return multiHashing.lyra2re.apply(this, arguments);
            }
        }
    },
    lyra2re2: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.lyra2rev2.apply(this, arguments);
            }
        }
    },
    lyra2rev2: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.lyra2rev2.apply(this, arguments);
            }
        }
    },
    lyra2rev3: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.lyra2rev3.apply(this, arguments);
            }
        }
    },
    lyra2z: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.lyra2z.apply(this, arguments);
            }
        }
    },
    neoscrypt: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.neoscrypt.apply(this, arguments);
            }
        }
    },
    yespower: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.yespower.apply(this, arguments);
            }
        }
    },
    yescrypt: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.yescrypt.apply(this, arguments);
            }
        }
    },
    yescryptr16v2: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.yescryptr16v2.apply(this, arguments);
            }
        }
    },
    yescryptr24: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.yescryptr24.apply(this, arguments);
            }
        }
    },
    yescryptr8: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.yescryptr8.apply(this, arguments);
            }
        }
    },
    yescryptr32: {
        multiplier: Math.pow(2, 16),
        hash: function(){
            return function(){
                return multiHashing.yescryptr32.apply(this, arguments);
            }
        }
    },
    quark: {
        hash: function(){
            return function(){
                return multiHashing.quark.apply(this, arguments);
            }
        }
    },
    keccak: {
        multiplier: Math.pow(2, 8),
        hash: function(coinConfig){
            if (coinConfig.normalHashing === true) {
                return function (data, nTimeInt) {
                    return multiHashing.keccak(multiHashing.keccak(Buffer.concat([data, new Buffer(nTimeInt.toString(16), 'hex')])));
                };
            }
            else {
                return function () {
                    return multiHashing.keccak.apply(this, arguments);
                }
            }
        }
    },
    blake: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.blake.apply(this, arguments);
            }
        }
    },
    blake2s: {
        hash: function(){
            return function(){
                return multiHashing.blake2s.apply(this, arguments);
            }
        }
    },
    blake2b: {
        hash: function(){
            return function(){
                return multiHashing.blake2b.apply(this, arguments);
            }
        }
    },
    skein: {
        hash: function(){
            return function(){
                return multiHashing.skein.apply(this, arguments);
            }
        }
    },
    groestl: {
        hash: function(){
            return function(){
                return multiHashing.groestl.apply(this, arguments);
            }
        }
    },
    groestlmyriad: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.groestlmyriad.apply(this, arguments);
            }
        }
    },
    pawelhash: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.pawelhash.apply(this, arguments);
            }
        }
    },
    padihash: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.padihash.apply(this, arguments);
            }
        }
    },
    jeonghash: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.jeonghash.apply(this, arguments);
            }
        }
    },
    astralhash: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.astralhash.apply(this, arguments);
            }
        }
    },
    globalhash: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.globalhash.apply(this, arguments);
            }
        }
    },
    fugue: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.fugue.apply(this, arguments);
            }
        }
    },
    shavite3: {
        hash: function(){
            return function(){
                return multiHashing.shavite3.apply(this, arguments);
            }
        }
    },
    hefty1: {
        hash: function(){
            return function(){
                return multiHashing.hefty1.apply(this, arguments);
            }
        }
    },
    qubit: {
        hash: function(){
            return function(){
                return multiHashing.qubit.apply(this, arguments);
            }
        }
    },
    quark: {
        hash: function(){
            return function(){
                return multiHashing.quark.apply(this, arguments);
            }
        }
    },
    hex: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.hex.apply(this, arguments);
            }
        }
    },
    dedal: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.dedal.apply(this, arguments);
            }
        }
    },
    c11: {
        hash: function(){
            return function(){
                return multiHashing.c11.apply(this, arguments);
            }
        }
    },
    phi1612: {
        hash: function(){
            return function(){
                return multiHashing.phi1612.apply(this, arguments);
            }
        }
    },
    phi2: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.phi2.apply(this, arguments);
            }
        }
    },
    tribus: {
        hash: function(){
            return function(){
                return multiHashing.tribus.apply(this, arguments);
            }
        }
    },
    allium: {
        multiplier: Math.pow(2, 8),
        hash: function(){
            return function(){
                return multiHashing.allium.apply(this, arguments);
            }
        }
    },
    arctichash: {
        hash: function(){
            return function(){
                return multiHashing.arctichash.apply(this, arguments);
            }
        }
    },
    deserthash: {
        hash: function(){
            return function(){
                return multiHashing.deserthash.apply(this, arguments);
            }
        }
    },
    cryptoandcoffee: {
        hash: function(){
            return function(){
                return multiHashing.cryptoandcoffee.apply(this, arguments);
            }
        }
    },
    rickhash: {
        hash: function(){
            return function(){
                return multiHashing.rickhash.apply(this, arguments);
            }
        }
    },
};


for (var algo in algos){
    if (!algos[algo].multiplier)
        algos[algo].multiplier = 1;

    /*if (algos[algo].diff){
        algos[algo].maxDiff = bignum(algos[algo].diff, 16);
    }
    else if (algos[algo].shift){
        algos[algo].nonTruncatedDiff = util.shiftMax256Right(algos[algo].shift);
        algos[algo].bits = util.bufferToCompactBits(algos[algo].nonTruncatedDiff);
        algos[algo].maxDiff = bignum.fromBuffer(util.convertBitsToBuff(algos[algo].bits));
    }
    else if (algos[algo].multiplier){
        algos[algo].maxDiff = diff1.mul(Math.pow(2, 32) / algos[algo].multiplier);
    }
    else{
        algos[algo].maxDiff = diff1;
    }*/
}
