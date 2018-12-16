#include "stdafx.h"
#include "Job.h"


Job::Job()
{
}


Job::~Job()
{
}

BOOL Job::CreateNewJob(const JobFunc &IN func, void *IN pParam)
{
    BOOL bReturn = FALSE;

    m_ThreadHandle = _beginthreadex(nullptr, 0, this->ThreadFunc, nullptr, CREATE_SUSPENDED, nullptr);


    return bReturn;
}

unsigned Job::ThreadFunc(void * pParam)
{
    
    while (true)
    {
        if (m_bIsStart)
        {
            if (m_JobData.func)
            {
                m_JobData.func(m_JobData.pJobParam);
            }
        }
        if (m_bIsTerminated)
        {
            break;
        }
    }
    return 0;
}
