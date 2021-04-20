import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './Transactions.css';
import UserContext from '../context/UserContext';
import TransactionsContext from '../context/TransactionsContext';
import TableRow from './TableRow';
import ErrorMsg from './ErrorMsg';

export default function Transactions() {
    const { userData } = useContext(UserContext)
    const { transactionsData } = useContext(TransactionsContext)
    const [data, setTransactionsData] = useState({
        'transactions': [],
        'cash': 0,
    })
    const [status, setStatus] = useState('getting data from server')
    const history = useHistory()
    if (!userData || userData === null || !userData.user || userData.user === null || userData.user === '') {
        history.push('/login')
    }
    const getData = async () => {
        try {
            console.log('transData ', transactionsData)
            const reqData = {
                'cash': transactionsData['cash'].toFixed(2),
                'transactions': []
            }
            transactionsData['transactions'].forEach(value => {
                reqData['transactions'].push([
                    value['type'],
                    [new Date(value['ttime']).toLocaleString(),
                    value['stockid'],
                    value['stockname'],
                    value['price'],
                    value['qty'].toFixed(2),
                    (value['price'] * value['qty']).toFixed(2)]])
            })
            setTransactionsData(reqData)
            setStatus('')

        }
        catch (err) {
            setStatus('could not get data')
            console.log(transactionsData)
            console.log('something went wrong', err)
        }
    }
    useEffect(() => {
        getData();
    }, [transactionsData])

    return (
        <div>
            <h4 style={{ "textAlign": "right " }}>Welcome, {(userData && userData.uname) || 'user'}</h4>
            <ErrorMsg value={status}></ErrorMsg>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Stock</th>
                        <th>NAME</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        data['transactions'].map((value, i) => <TableRow value={value[1]} className={value[0] === 'b' ? 'bought' : 'sold'} key={i} />)
                    }
                    <tr>
                        <td colSpan={5}>Available Cash</td>
                        <td>{data['cash']}</td>
                    </tr>
                </tbody>
                <tfoot>
                </tfoot>
            </table >

        </div >
    )
}
