import '../App.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HeaderLoginGoogle from '../components/HeaderLoginGoogle';
import axios from 'axios';
import { Card } from 'reactstrap';

function JobDetail() {
    let { id } = useParams();
    const [jobDetail, setJobDetail] = useState([]);
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    }
    useEffect(() => {
        axios.get(
            'http://dev3.dansmultipro.co.id/api/recruitment/positions/'+id
        )
        .then(response => {
            setJobDetail(response.data)
        })
        .catch(err => {
            // Handle errors
            console.error(err);
        });
    }, [jobDetail]);

    return (
        <div className="App">
            <HeaderLoginGoogle/>
            <div className='container-fluid' style={{ textAlign:'left', height: "calc(100vh - 80px)", overflowY: "scroll", backgroundColor:'#fafafa' }}>
                <div className='px-3'>
                    <div className='my-4'>
                        <Link style={{ fontWeight:'bold' }} onClick={goBack}>{`<< Back`}</Link>
                    </div>
                    <Card className='p-3 mb-4'>
                        <p className='mb-2'>{jobDetail.type} / {jobDetail.location}</p>
                        <h4 className='mb-3'>{jobDetail.title}</h4>
                        <div className='underline-grey'/>
                        <div className='row'>
                            <div className='col-8'>
                                <div dangerouslySetInnerHTML={{ __html: jobDetail.description }}/>
                            </div>
                            <div className='col-4'>
                                <Card className='p-3 mb-3' style={{ backgroundColor:'#fafafa' }}>
                                    <h5 className='font-weight-bold'>{jobDetail.company}</h5>
                                    <img src={jobDetail.company_logo} style={{ minHeight:200 }}/>
                                    <a href={jobDetail.company_url}>{jobDetail.company_url}</a>
                                </Card>
                                <Card className='p-3' style={{ backgroundColor:'#FFFDD0' }}>
                                    <h5>How to apply:</h5>
                                    <div dangerouslySetInnerHTML={{ __html: jobDetail.how_to_apply }}/>
                                </Card>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default JobDetail;
