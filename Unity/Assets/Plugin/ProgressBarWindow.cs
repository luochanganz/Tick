using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEditor;
using UnityEngine;

namespace Assets.Plugin
{
    class ProgressBarWindow: EditorWindow
    {
        ProgressBarWindow m_Instance;

        private float m_Progress;

        public void Open()
        {
            if (m_Instance == null)
            {
                m_Instance = (ProgressBarWindow)GetWindow(typeof(ProgressBarWindow), false, "Demo Window", true);
            }
            m_Instance.Show();
            m_Instance.m_Progress = 0;
        }

        public new void Close()
        {
            if (m_Instance == null)
            {
                return;
            }
            m_Instance.Close();
        }

        public void UdpateProgress(float fProgress)
        {
            m_Instance.m_Progress = fProgress;
        }

        private void OnGUI()
        {
            RenderProgressSlider();
        }

        private void RenderProgressSlider()
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField("进度：");

            var tmpRect = GUILayoutUtility.GetRect(10, 15);

            var backRect = new Rect(40, tmpRect.y, 200, 15f);
            var contentRect = new Rect(backRect);
            contentRect.width = m_Progress * 2;
            EditorGUI.DrawRect(backRect, Color.white);
            EditorGUI.DrawRect(contentRect, new Color32(6, 176, 37, 255));

            var valueRect = new Rect(tmpRect);
            valueRect.x = contentRect.x + 210;
            GUI.Label(valueRect, m_Progress + "%");
            EditorGUILayout.EndHorizontal();
        }
    }
}
