import { useEffect, useGlobal, useState } from 'reactn';
import { connectWallet,
formatAddress,
networkIdToName,
transactContractMany,
transactContractSingle,
transactContractWithWallet,
getTokenIdsForAddress,
doActionWithManyOrcs } from './lib/blockchain';



function App() {

    
    const [orcsContract, setOrcsContract] = useState('0xf40E6e68c13e7D445638928e74715bed30FdfE1A');
    const [proxyContract, setProxyContract] = useState('0x7cD518787b42f94Db3d6d22e19dA630dA11E8101');


    // const [approved, setApproved] = useState('');
    const [ints, setInts] = useState('1,2,3');
    const [singleint, setSingleint] = useState('');
    const [address] = useGlobal('address');
    const [chainId] = useGlobal('chainId');
    const [tokenIds] = useGlobal('tokenIds');
    const [actions] = useGlobal('actions');

    useEffect(() => {
        
        init();
        
    }, [address]);

    const init = async () => {
        await connectWallet();
        if(address){
            await getTokenIdsForAddress(orcsContract);
        }
    }

    const unstake = async () => {
        var training_ids = [];
        var i = 0;
        for(var a of actions){
            if(a.action === 2){ // training
                training_ids.push(tokenIds[i]);
            }
            i++;
        }
        await doActionWithManyOrcs(orcsContract, training_ids, 0);
        getTokenIdsForAddress(orcsContract);
        
        console.log(training_ids);
    }

    var showUnstake = false;
    if(actions){
        for(var a of actions){
            if(a.action == 2) showUnstake = true;
        }
    }


    return (
        <div>

            

            <div className="max-w-5xl mt-24 mb-12 mx-auto">

                <div className="mb-2">Orcs contract (address):</div>
                <div className="mb-4">
                    <input type="text" value={orcsContract} style={{width: 450}} onChange={e => setOrcsContract(e.target.value)}></input>
                </div>

                <div className="mb-2">Proxy contract (address):</div>
                <div className="mb-12">
                    <input type="text" value={proxyContract} style={{width: 450}} onChange={e => setProxyContract(e.target.value)}></input>
                </div>


                {!address &&
                    <div className="mb-12">
                        <button onClick={() => connectWallet()}>Connect with Metamask</button>
                    </div>
                }
                {address &&
                    <div className="mb-12">
                        <div className="text-gray-400 mb-8">Connected as: {formatAddress(address)} on {networkIdToName(chainId)}</div>
                        {!tokenIds && <div>Fetching tokens...</div>}

                        {!!tokenIds &&
                            <div style={{padding: 10, width: 300, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.4)', overflow: 'scroll', height: 200}}>
                                {tokenIds.map((t, i) => <div key={i}>
                                    Token ID: {t}, action: {actions[i].action}
                                </div>)}
                            </div>
                        }
                        
                        {!!tokenIds && tokenIds.length > 0 && showUnstake &&
                            <div className="mt-4">
                                <button onClick={() => unstake()}>Unstake</button>
                            </div>
                        }

                        {/*                 
                        <div className="mb-2 mt-10">Approve:</div>
                        <div className="flex">
                            <div>
                                <select value={approved}  onChange={e => setApproved(e.target.value)}>
                                    <option value="true">true</option>
                                    <option value="false">false</option>
                                </select>
                            </div>
                            <div className="pl-4">
                                <button onClick={() => transactContractWithWallet(contract, 'setApprovalForAll', approved)}>setApprovalForAll</button>
                            </div>
                        </div> */}


                        <div className="pt-12">
                            <div>
                                <button onClick={() => transactContractWithWallet(orcsContract, proxyContract, 'setApprovalForAll', true)}>setApprovalForAll</button>
                            </div>
                        </div> 


                        <div className="mb-2 mt-10">Value (single int):</div>
                        <div className="flex">
                            <div>
                            <input type="text" style={{width: 450}} value={singleint} onChange={e => setSingleint(e.target.value)}></input>
                            </div>
                            <div className="pl-4">
                                <button className="mr-4" onClick={() => {
                                    if(singleint == '') return;
                                    transactContractSingle(proxyContract, 'migrateAndFarm', singleint)
                                }}>MigrateAndFarm</button>
                                <button className="mr-4" onClick={() => {
                                    if(singleint == '') return;
                                    transactContractSingle(proxyContract, 'migrateAndTrain', singleint)
                                }}>MigrateAndTrain</button>
                                <button onClick={() => {
                                    if(singleint == '') return;
                                    transactContractSingle(proxyContract, 'justMigrate', singleint)
                                }}>Migrate</button>
                            </div>
                        </div>


                        <div className="mb-2 mt-10">Values (comma separated):</div>
                        <div className="flex mb-48">
                            <div>
                            <input type="text" style={{width: 450}} value={ints} onChange={e => setInts(e.target.value)}></input>
                            </div>
                            <div className="pl-4">
                                <button className="mr-4" onClick={() => transactContractMany(proxyContract, 'migrateManyAndFarm', ints)}>MigrateManyAndFarm</button>
                                <button className="mr-4" onClick={() => transactContractMany(proxyContract, 'migrateManyAndTrain', ints)}>MigrateManyAndTrain</button>
                            </div>
                        </div>

                        
                    </div>
                }

                
                
                
                
                
            </div>
        </div>
    );
}

export default App;