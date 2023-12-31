import React, { useEffect, useState } from 'react';
import axios from 'axios';
import correct from '../images/youre-right-blippi.gif';
import wrong from '../images/oh-no-blippi.gif';
import giphy from '../images/giphy.gif';

export default function Maincontainer() {

    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [currentUserTitle, setCurrentUserTitle] = useState("");
    const [userMail, setUserMail] = useState([]);
    const [userTitle, setUserTitle] = useState([]);
    const [currentPage, setCurrentPage] = useState("GetEmail");

    const [editingData, setEditingData] = useState(null);

    const [finalList, setFinalList] = useState({});
    const [userClicked, setUserClicked] = useState();
    const [checkingProcess, setCheckingProcess] = useState({ "FromName": "", "ToName": "" });
    const [rajaName, setRajaName] = useState("");

    const [titleOrder, setTitleOrder] = useState([])
    const [getRecentEmail, setGetRecentEmail] = useState([])
    const [getRecentUserTitle, setGetRecentUserTitle] = useState([])
    const [recentEmailView, setRecentEmailView] = useState(true)
    const [recentTitleView, setRecentTitleView] = useState(true)


    const [status, setStatus] = useState('')

    function shuffleArray(array) {
        // for (let i = array.length - 1; i > 0; i--) {
        //     // Generate a random index between 0 and i (inclusive)
        //     const randomIndex = Math.floor(Math.random() * (i + 1));
        //     // Swap the elements at randomIndex and i
        //     [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        // }
        // return array;

        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * i);
            [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
        }
        return array;
    }
    function getKeyByValue(object, value) {
        for (const key in object) {
            if (object[key] === value) {
                return key;
            }
        }
        return null; // Return null if the value is not found
    }
    async function emailSend(FinalList) {
        console.log(FinalList)
        let a = await axios.post('http://localhost:8000/users', { "FinalList": FinalList })
        // Object.keys(FinalList).map((email) => {
        //     const config = {
        //         Host: "smtp.elasticemail.com",
        //         Username: "ramesh.official@yopmail.com",
        //         Password: "891EADB2F2E81A7FAD3C4E4483435926BD37",
        //         Port: 2525,
        //         To: email,
        //         From: "rameshoffice1999@gmail.com",
        //         Subject: "Raja - Rani Game Title",
        //         Body: `Your Title is ${FinalList[email]}`,
        //     }
        //     if (window.Email) {
        //         window.Email.send(config).then(() => alert("email sent successfully"))
        //     }
        // })
    }
    async function swapEmailSend(email, title) {
        let a = await axios.post('http://localhost:8000/users', { "swapMail": { email: email, title: title } })
        // const config = {
        //     Host: "smtp.elasticemail.com",
        //     Username: "ramesh.official@yopmail.com",
        //     Password: "891EADB2F2E81A7FAD3C4E4483435926BD37",
        //     Port: 2525,
        //     To: email,
        //     From: "rameshoffice1999@gmail.com",
        //     Subject: "Raja - Rani Game Title",
        //     Body: `Your Title is ${title}`,
        // }
        // if (window.Email) {
        //     window.Email.send(config).then(() => alert("email sent successfully"))
        // }

    }
    useEffect(() => {
        Object.values(finalList).map((e, i) => {
            if (e == titleOrder[0]) {
                const key = getKeyByValue(finalList, e);
                setRajaName(key)
            }
        })
    }, [currentPage, finalList, titleOrder])
    function finalCheckingProcessFunction() {
        let ab = finalList[checkingProcess.FromName]
        if (titleOrder[titleOrder.indexOf(ab) + 1] == finalList[checkingProcess.ToName]) {
            const itemToRemove = checkingProcess.FromName;
            const updatedUserMail = userMail.filter((item) => item !== itemToRemove);
            setUserMail(updatedUserMail);
            setUserClicked(null)
            setCheckingProcess({ FromName: "", ToName: "" })
            let a = [...titleOrder]
            a.shift();
            setTitleOrder(a)
            setStatus('correct')

        } else {
            for (let index = 0; index < 2; index++) {
                if (index == 0) {
                    swapEmailSend(checkingProcess.FromName, finalList[checkingProcess.ToName])
                } else {
                    swapEmailSend(checkingProcess.ToName, finalList[checkingProcess.FromName])
                }
            }
            setFinalList({ ...finalList, [checkingProcess.FromName]: finalList[checkingProcess.ToName], [checkingProcess.ToName]: finalList[checkingProcess.FromName] })
            setUserClicked(null)
            setCheckingProcess({ FromName: "", ToName: "" })
            setStatus('wrong')
        }
    }

    function editButton(e, i) {
        if (currentPage === "GetEmail") {
            setCurrentUserEmail(e)
            setEditingData({ index: i, editedMail: e })
        }
        if (currentPage === "GetTitle") {
            setCurrentUserTitle(e)
            setEditingData({ index: i, editedUserTitle: e })
        }
    }

    function deleteButton(e, i) {
        if (currentPage === "GetEmail") {
            let b = [...userMail]
            let a = b.filter((data) => data !== e);
            setUserMail(a)
        }
        if (currentPage === "GetTitle") {
            let b = [...userTitle]
            let a = b.filter((data) => data !== e);
            setUserTitle(a)
        }

    }
    useEffect(() => {
        setTimeout(() => {
            setStatus("")
        }, 3000)
    }, [status])

    async function postRecentDatas() {
        try {
            if (currentPage === "GetEmail") {
                const res = await axios.post('https://659010a0cbf74b575eca6df0.mockapi.io/emails', { "userMails": userMail })
            }
            // if (currentPage === "GetTitle") {
            //     const res = await axios.post('https://659010a0cbf74b575eca6df0.mockapi.io/usertitles', { "usertitles": userTitle })

            // }
        } catch (error) {
            console.log("Error in recentEmails")
        }
    }

    async function getRecentDatas() {
        try {
            if (currentPage === "GetEmail") {
                const res = await axios.get('https://659010a0cbf74b575eca6df0.mockapi.io/emails')
                setGetRecentEmail(res.data)
            }
            if (currentPage === "GetTitle") {
                const res = await axios.get('https://659010a0cbf74b575eca6df0.mockapi.io/usertitles')
                setGetRecentUserTitle(res.data[0].usertitles)
            }
        } catch (error) {
            console.log("Error in recentEmails")
        }
    }
    async function deleteRecentDatas() {
        if (currentPage === "GetEmail") {
            try {
                const res = await axios.get(`https://659010a0cbf74b575eca6df0.mockapi.io/emails`)
                const data = res.data;
                if (data && data.length > 5) {
                    try {
                        for (let index = 0; index < 4; index++) {
                            const res = await axios.delete(`https://659010a0cbf74b575eca6df0.mockapi.io/emails/${data[index].id}`)

                        }
                    } catch (error) {
                        console.log("deleteRecentDatas datas")
                    }
                }
            } catch (error) {
                console.log("Error in deleteRecentDatas function")
            }
        }
        if (currentPage === "GetTitle") {
            try {

                const res = await axios.get(`https://659010a0cbf74b575eca6df0.mockapi.io/usertitles`)
                const data = res.data;
                if (data && data.length > 5) {
                    try {
                        for (let index = 0; index < 4; index++) {
                            const res = await axios.delete(`https://659010a0cbf74b575eca6df0.mockapi.io/usertitles/${data[index].id}`)

                        }
                    } catch (error) {
                        console.log("deleteRecentDatas datas")
                    }
                }
            } catch (error) {
                console.log("Error in deleteRecentDatas function")
            }
        }

    }
    useEffect(() => {
        getRecentDatas()
    }, [currentPage])
    console.log(userMail)
    return (
        <>
            {
                (status != "") ?
                    <>
                        {
                            status == "correct" ?
                                <img src={correct} height={300} width={300} /> :
                                <>
                                    <img src={wrong} height={300} width={300} />
                                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>
                                        You Are Wrong
                                    </div>
                                </>
                        }
                    </>
                    :
                    <div style={{ textAlign: "center", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                        {
                            currentPage === "GetEmail" &&
                            <>
                                Enter User Email
                                <div>
                                    <input value={currentUserEmail} onChange={(e) => { setCurrentUserEmail(e.target.value) }} />
                                    <button onClick={() => {
                                        if (currentUserEmail == "") {
                                            alert("fill user mail")
                                            return;
                                        }
                                        if (userMail.includes(currentUserEmail) && (editingData && editingData.editedMail !== currentUserEmail)) {
                                            alert("email id already exists")
                                            return;
                                        }
                                        if (editingData !== null) {
                                            const data = [...userMail]
                                            data[editingData.index] = currentUserEmail;
                                            setUserMail(data)
                                            setCurrentUserEmail("")
                                            setEditingData(null)
                                        } else {
                                            setUserMail([...userMail, currentUserEmail])
                                            setCurrentUserEmail("")
                                            setEditingData(null)
                                        }
                                    }}>Add</button>
                                </div>
                                <div style={{ height: "auto", display: "flex", alignItems: "center", flexDirection: "column" }}>
                                    {
                                        userMail && userMail.map((e, i) => (
                                            <>
                                                <div key={i} style={{ boxShadow: "0px 10px 10px #004E9C33", border: "1px solid #A9C3DC", margin: "10px", width: "350px", display: "flex", justifyContent: "center", position: "relative" }}>
                                                    {i + 1}.{e}
                                                    <div style={{ position: "absolute", right: "0px", bottom: "0px", cursor: "pointer" }}>
                                                        <button style={{ cursor: "pointer" }} onClick={() => { editButton(e, i) }}>edit</button>
                                                        <button onClick={() => { deleteButton(e, i) }}>delete</button>
                                                    </div>
                                                </div>
                                            </>
                                        ))
                                    }
                                </div>
                                <button style={{ marginTop: "10px" }} disabled={userMail.length >= 3 ? false : true} onClick={
                                    () => {
                                        postRecentDatas()
                                        deleteRecentDatas()
                                        setCurrentPage("GetTitle")
                                    }}>Submit</button>

                                {
                                    recentEmailView &&
                                    <>
                                        <h2>Recent Used Emails</h2>
                                        {
                                            getRecentEmail && getRecentEmail.map((e, i) =>

                                                <div style={{ height: "auto", width: "80%", border: "1px solid black", marginTop: "10px", padding: "5px", wordBreak: "break-word" }} onClick={() => {
                                                    setUserMail(e.userMails)
                                                    setRecentEmailView(false)
                                                }}>
                                                    {` ${e.userMails}`}

                                                </div>
                                            )
                                        }
                                    </>
                                    // <h2></h2>


                                }
                            </>
                        }
                        {
                            currentPage === "GetTitle" &&
                            <>
                                Enter Title
                                <div>
                                    <input value={currentUserTitle} onChange={(e) => { setCurrentUserTitle(e.target.value) }} />
                                    <button onClick={() => {
                                        if (currentUserTitle == "") {
                                            alert("fill user title")
                                            return;
                                        }
                                        if (userTitle.includes(currentUserTitle) && (editingData && editingData.editedUserTitle !== currentUserTitle)) {
                                            alert("user title already exists")
                                            return;
                                        }
                                        if (editingData !== null) {
                                            const data = [...userTitle]
                                            data[editingData.index] = currentUserTitle;
                                            setUserTitle(data)
                                            setTitleOrder([...data, currentUserTitle])
                                            setCurrentUserTitle("")
                                            setEditingData(null)
                                        } else {
                                            setUserTitle([...userTitle, currentUserTitle])
                                            setTitleOrder([...userTitle, currentUserTitle])
                                            setCurrentUserTitle("")
                                        }
                                    }} disabled={((userTitle.length == userMail.length) && !editingData) ? true : false}>Add</button>
                                </div>

                                <div style={{ height: "auto", display: "flex", alignItems: "center", flexDirection: "column" }}>
                                    {
                                        userTitle && userTitle.map((e, i) => (
                                            <div key={i} style={{ boxShadow: "0px 10px 10px #004E9C33", border: "1px solid #A9C3DC", margin: "10px", width: "350px", position: "relative" }}>
                                                {i + 1}.{e}
                                                <div style={{ position: "absolute", right: "0px", bottom: "0px", cursor: "pointer" }}>
                                                    <button style={{ cursor: "pointer" }} onClick={() => { editButton(e, i) }}>edit</button>
                                                    <button onClick={() => { deleteButton(e, i) }}>delete</button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <button style={{ marginTop: "10px" }} disabled={userTitle.length == userMail.length ? false : true} onClick={async () => {
                                    if (userMail.length == userTitle.length) {
                                        let SuffleTitle = shuffleArray(userTitle)
                                        let FinalList = {}
                                        SuffleTitle.map((e, i) => {
                                            FinalList[userMail[i]] = e
                                        })
                                        setFinalList(FinalList)
                                        emailSend(FinalList)
                                        setCurrentPage("chooseTitle")
                                        postRecentDatas()
                                        deleteRecentDatas()
                                    } else {
                                        alert("user mail and user title count mismatch")
                                    }


                                }}>Submit</button>
                                {
                                    recentTitleView &&
                                    <>
                                        <h2>Suggested Titles</h2>
                                        {
                                            getRecentUserTitle && getRecentUserTitle.map((e, i) =>

                                                <div style={{ height: "auto", width: "80%", border: "1px solid black", marginTop: "10px", padding: "5px", wordBreak: "break-word" }} onClick={() => {
                                                    setCurrentUserTitle(e)
                                                    // setUserTitle(e.usertitles)
                                                    // setRecentTitleView(false)
                                                }}>
                                                    {` ${e}`}

                                                </div>
                                            )
                                        }
                                    </>
                                    // <h2></h2>


                                }
                            </>
                        }
                        {
                            currentPage === "chooseTitle" &&
                            <>
                                {
                                    userMail.length == 1 ?
                                        <>
                                            <img src={giphy} height={300} width={300} />
                                            <div style={{ fontSize: "30px", fontWeight: "bold" }}>
                                                Bye Bye
                                            </div>
                                        </> :
                                        <>
                                            <div style={{ border: "1px solid blue", padding: "10px", margin: "10px" }}>
                                                {titleOrder[0]}👑 :{rajaName}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                                {
                                                    userMail.map((e, i) => (
                                                        <div
                                                            style={{ height: "20px", border: userClicked == i ? "2px solid black" : "", color: "white", borderRadius: "5PX", width: "200px", background: rajaName !== e ? "grey" : "#0055D4 0% 0% no-repeat padding-box", marginBottom: "10px", textAlign: "center", padding: "10px", cursor: rajaName !== e ? "not-allowed" : "pointer" }}
                                                            onClick={() => {
                                                                if (rajaName == e) {
                                                                    setCheckingProcess({ ...checkingProcess, FromName: e })
                                                                    setUserClicked(i)
                                                                }
                                                            }}
                                                            key={i}>
                                                            {
                                                                rajaName == e ? e : "Disabled"
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <hr />
                                            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                                {
                                                    userMail.map((e, i) => (
                                                        <div
                                                            key={i}
                                                            style={{ height: "20px", border: checkingProcess.ToName == e ? "2px solid black" : "", borderRadius: "5PX", width: "200px", color: "white", background: userClicked == i ? "grey" : "#0055D4 0% 0% no-repeat padding-box", marginBottom: "10px", textAlign: "center", padding: "10px", cursor: userClicked == i ? "not-allowed" : "pointer" }}
                                                            onClick={() => {
                                                                if (userClicked !== i) {
                                                                    setCheckingProcess({ ...checkingProcess, ToName: e })
                                                                }

                                                            }}>
                                                            {
                                                                userClicked == i ? "Disabled" : e
                                                            }

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <hr />
                                            <button onClick={() => {
                                                finalCheckingProcessFunction()
                                            }}>Submit</button>
                                        </>
                                }

                            </>
                        }
                        {/* {
                <div>
                    Recent Used Email
                </div>
            } */}
                    </div>

            }

        </>
    )
}