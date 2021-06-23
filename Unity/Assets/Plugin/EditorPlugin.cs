using Assets.Plugin;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEditor;
using UnityEngine;

public class DemoEditorWindow : EditorWindow
{
    static ProgressBarWindow m_PluginWindow;
    static float m_StartTime;
    static float m_NowTime;
    static float m_Progress;

    [MenuItem("Window/ProgressBarWindow")]
    static void OpenProgressBarWindow()
    {
        if(m_PluginWindow != null)
        {
            m_PluginWindow.Close();
        }
       
        m_PluginWindow = CreateInstance<ProgressBarWindow>();

        m_StartTime = 0;
        m_NowTime = 0;
        m_Progress = 0;
        
        
        m_PluginWindow.Open();
        Task.Run(() =>
        {
            _ = UpdateProgressAsync();
        });
    }

    // Update is called once per frame
    static async Task UpdateProgressAsync()
    {
        while (true)
        {
            m_NowTime += 1f;
            if (m_NowTime - m_StartTime > 10)
            {
                
                m_Progress += 1;
                m_PluginWindow.UdpateProgress(m_Progress);
            }
            Debug.Log("m_NowTime" + m_NowTime + "m_StartTime"+ m_StartTime + "m_Progress" + m_Progress);
            if (m_Progress >= 100)
            {
                break;
            }
            await Task.Delay(100);
        }

    }
}
