using Meta.Voice.NLayer;
using Oculus.Interaction;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography.X509Certificates;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.Rendering;
using UnityEngine.UI;
using static UnityEngine.ScreenCapture;


public class ScreenCaptureShot : MonoBehaviour
{
    public InteractableUnityEventWrapper eventWrapper;
    public Camera cam;
    // private RenderTexture renderTexture;
    public int resWidth = 1024;
    public int resHeight = 1024;

    public TextMeshPro textFeedback;

    public GameObject UI;
    private void Start()
    {
        eventWrapper.WhenSelect.AddListener(() => StartCoroutine(TakeScreenshot()));
       StartCoroutine(TakeScreenshot());
    }

    public void StartCoroutineForScreenshot() 
    {
        StartCoroutine(TakeScreenshot());
    }
    public string ScreenShotName(int width, int height)
    {
        return string.Format("{0}/screen_{1}x{2}_{3}.png",
                             Application.persistentDataPath,
                             width, height,
                             System.DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss"));
    }

    IEnumerator  TakeScreenshot()

    {
        Debug.Log("<color=red>Starting Screenshot</color>");
        UI.SetActive(false);

     yield return null;
            string filename = ScreenShotName(resWidth, resHeight);
        //ScreenCapture.CaptureScreenshot(filePath);
            RenderTexture rt = new RenderTexture(resWidth, resHeight, 24);
        cam.targetTexture = rt;
            Texture2D screenShot = new Texture2D(resWidth, resHeight, TextureFormat.RGB24, false);
        cam.Render();

        RenderTexture.active = rt;
            screenShot.ReadPixels(new Rect(0, 0, resWidth, resHeight), 0, 0);
        cam.targetTexture = null;
            RenderTexture.active = null; // JC: added to avoid errors
            Destroy(rt);
            byte[] bytes = screenShot.EncodeToPNG();

        System.IO.File.WriteAllBytes(filename, bytes);
        textFeedback.text = string.Format("Took screenshot");
            Debug.Log(string.Format("<color=red>Took screenshot to: {0}</color>", filename));


        WWWForm form = new WWWForm();
        form.AddBinaryData("file", bytes, filename, "multipart/form-data");

        // Create a UnityWebRequest
        UnityWebRequest www = UnityWebRequest.Post("https://192.168.0.121:3000/run/yolo/file", form);
        www.certificateHandler = new BypassCertificate();
        textFeedback.text = string.Format("Uploading to Machine learning");

        // Send the request
        www.SendWebRequest().completed += (a)=> { OnUploadComplete(www); };


        yield return null;
        UI.SetActive(true);
    }

    public class BypassCertificate : CertificateHandler
    {
        protected override bool ValidateCertificate(byte[] certificateData)
        {
            //Simply return true no matter what
            return true;
        }
    }
    private void OnUploadComplete(UnityWebRequest www)
    {
        if (www.result == UnityWebRequest.Result.Success)
        {
            // Get the response image
            Texture2D responseImage = new Texture2D(1, 1);
            responseImage.LoadImage(www.downloadHandler.data);

            // Display the image
            GameObject imageObject = GameObject.Find("Image");
            imageObject.GetComponent<Renderer>().material.mainTexture = responseImage;

            Debug.Log("File uploaded and image received successfully!");
            textFeedback.text = string.Format("Image retrieved from Machine learning");
        }
        else
        {
            Debug.LogError("Error uploading file or receiving image: " + www.error);
        }
    }
    
}
public class FileDetails 
{
    public string filepath, fileName,filetype;
}
