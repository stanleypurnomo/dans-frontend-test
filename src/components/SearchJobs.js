import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';

function SearchJobs() {
    const [jobDesc, setJobDesc] = useState('');
    const [jobLoc, setJobLoc] = useState('');
    const [searchState, setSearchState] = useState(false);
    const [fullTime, setFullTime] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currPage, setCurrPage] = useState(1);
    const [prevPage, setPrevPage] = useState(0);
    const [jobList, setJobList] = useState([]);
    const [wasLastList, setWasLastList] = useState(false);
    const listInnerRef = useRef();
    const searchJobs = async () => {
        axios.get('http://dev3.dansmultipro.co.id/api/recruitment/positions.json?description='+jobDesc+'&location='+jobLoc+'&full_time='+fullTime).then((response) => {
            setJobList(response.data)
            setSearchState(true)
        });
    }

    const fetchDataScroll = async () => {
        axios.get(
            'http://dev3.dansmultipro.co.id/api/recruitment/positions.json?description='+jobDesc+'&location='+jobLoc+'&full_time='+fullTime+'&page='+currPage
        )
        .then(response => {
            if (!response.data && !response.data.length) {
                setWasLastList(true);
                setLoading(false)
                return;
            }
            setPrevPage(currPage);
            setTimeout(()=>{
                setJobList([...jobList, ...response.data]);
                setLoading(false)
            }, 3000)
        })
        .catch(err => {
            // Handle errors
            console.error(err);
            setLoading(false)
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            axios.get(
                'http://dev3.dansmultipro.co.id/api/recruitment/positions.json?description='+jobDesc+'&location='+jobLoc+'&full_time='+fullTime+'&page='+currPage
            )
            .then(response => {
                if (!response.data && !response.data.length) {
                    setWasLastList(true);
                    setLoading(false)
                    return;
                }
                setPrevPage(currPage);
                setTimeout(()=>{
                    setJobList([...jobList, ...response.data]);
                    setLoading(false)
                }, 1000)
            })
            .catch(err => {
                // Handle errors
                console.error(err);
                setLoading(false)
            });
        };
        if (!wasLastList && prevPage !== currPage) {
          fetchData();
        }
    }, [currPage, wasLastList, prevPage, jobList]);

    const onScroll = () => {
        if (listInnerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
          if (scrollTop + clientHeight === scrollHeight) {
            setLoading(!loading)
            setCurrPage(currPage + 1)
          }
        }
      };
    return (
        <div className='container-fluid' style={{ textAlign:'left', height: "calc(100vh - 80px)", overflowY: "scroll", backgroundColor:'#fafafa' }} onScroll={onScroll} ref={listInnerRef}>
            <h3 style={{ opacity:0, margin:0, fontSize:8 }}>Search Jobs:</h3>
            <form className='mt-2 mb-4 px-3'>
                <div class="row">
                    <div class="col-3 form-group">
                        <label className='form-label'>Job Description</label>
                        <input type="text" className='form-control' value={jobDesc} onChange={(e)=>{ setJobDesc(e.target.value) }}/>
                    </div>
                    <div class="col-3 form-group">
                        <label className='form-label'>Job Location</label>
                        <input type="text" className='form-control' value={jobLoc} onChange={(e)=>{ setJobLoc(e.target.value) }}/>
                    </div>
                    <div class="col-3 form-group">
                        <div>
                            <label className='form-label'>ㅤ</label>
                        </div>
                        <input id="fullTime" type="checkbox" className='form-check-input me-2' onChange={(e)=>{ setFullTime(e.target.checked) }}/>
                        <label className='form-label' for="fullTime">Full Time Only</label>
                    </div>
                    <div class="col-3 form-group text-end">
                        <Button style={{ backgroundColor:'#2196f3', border:'none' }} className='mt-4' onClick={()=>{ searchJobs(); }}>Search</Button>
                    </div>
                </div>
            </form>
            <div className='px-3'>
                <Card className='p-3 mb-4'>
                    <div className='job-list'>
                        <h3 className='mt-3 mb-4 font-weight-bold'>{ searchState ? jobList.length > 1 ? 'Showing '+jobList.length+' jobs' : 'Showing '+jobList.length+' job' : 'Job List'}</h3>
                        {
                            jobList.length > 0
                            ?
                            jobList.map((item, index)=>{
                                return(
                                    item !== null
                                    ?
                                    <div className='row px-3' key={index}>
                                        <div className='underline-grey'/>
                                        <div className='col-10 ps-0'>
                                            <Link style={{ textDecoration:'none' }} to={`detail/`+item.id}>
                                                <h5>{item.title}</h5>
                                            </Link>
                                            <p>{item.company} - <span style={{ fontWeight:'bold', color:'green' }}>{item.type}</span></p>
                                        </div>
                                        <div className='col-2 text-end'>
                                            <p>{item.location}</p>
                                        </div>
                                        {
                                            index === jobList.length-1
                                            ?
                                            <div className='underline-grey'/>
                                            :
                                            null
                                        }
                                    </div>
                                    :
                                    null
                                )
                            })
                            :
                            null
                        }
                        {
                            loading
                            ?
                            <div className='text-center py-2' style={{ position:'absolute', bottom:'0.125em', background:'rgba(33,150,243,0.5)', left:0, width:'100vw' }}>
                                <Spinner color='white' className='text-center' style={{ width: '2rem', height: '2rem' }} children={false} />
                            </div>
                            :
                            false
                        }
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default SearchJobs;
