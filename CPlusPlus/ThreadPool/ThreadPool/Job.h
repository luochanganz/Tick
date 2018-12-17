#include <Windows.h>
#include <process.h>

using JobFunc = void(*)(void*);
using ThreadHandle = uintptr_t;
class Job
{
    struct JobParam
    {
        JobFunc func;
        void* pJobParam;
    };

public:
    Job();
    virtual ~Job();
    BOOL CreateNewJob(const JobFunc& IN func, void* IN pParam);
    BOOL SetJobFunc(const JobFunc& IN func, void* IN pParam);
    BOOL StartJob();
    BOOL SuspendJob();
    BOOL TerminateJob();
private:
    unsigned ThreadFunc(void* pParam);
private:
    JobParam m_JobData;
    uintptr_t m_ThreadHandle;

private:
    BOOL m_bIsStart;
    BOOL m_bIsTerminated;
};

