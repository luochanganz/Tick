#include "stdafx.h"
#include "Job.h"


Job::Job()
{
    m_bIsSuspend = TRUE;
    m_bIsTerminated = FALSE;
}


Job::~Job()
{
}

BOOL Job::CreateNewJob()
{
    BOOL bReturn = FALSE;

    m_ThreadHandle = _beginthreadex(nullptr, 0, ThreadFunc, nullptr, CREATE_SUSPENDED, nullptr);
    if (m_ThreadHandle == 0)
    {
        return FALSE;
    }

    return bReturn;
}

void Job::SetJobFunc(const JobFunc &IN func, void *IN pParam)
{
    m_JobData.func = func;
    m_JobData.pJobParam = pParam;
}

BOOL Job::StartJob()
{
    BOOL bReturn    = FALSE;
    BOOL bRetCode   = FALSE;
    m_bIsSuspend    = false;
    bRetCode = ResumeThread((HANDLE)m_ThreadHandle);
    while (bRetCode > 1)
    {
        bRetCode = ResumeThread((HANDLE)m_ThreadHandle);
    }
    if (bRetCode == (DWORD)-1)
    {
        goto Exit0;
    }
Exit1:
    bReturn = TRUE;
Exit0:
    return bReturn;
}

BOOL Job::SuspendJob()
{
    BOOL bReturn = FALSE;
    BOOL bRetCode = FALSE;
    m_bIsSuspend = true;
    bRetCode = SuspendThread((HANDLE)m_ThreadHandle);
    if (bRetCode == (DWORD)-1)
    {
        goto Exit0;
    }

Exit1:
    bReturn = TRUE;
Exit0:
    return bReturn;
}

BOOL Job::TerminateJob()
{
    m_bIsTerminated = TRUE;
    return TRUE;
}

unsigned Job::ThreadFunc(void *)
{
    Job* pThis = new Job;
    while (true)
    {
        if (!pThis->m_bIsSuspend)
        {
            if (pThis->m_JobData.func)
            {
                pThis->m_JobData.func(pThis->m_JobData.pJobParam);
            }
        }
        if (pThis->m_bIsTerminated)
        {
            break;
        }
    }
    return 0;
}
