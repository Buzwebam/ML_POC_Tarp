using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SphereController : MonoBehaviour
{
    public List<Texture2D> textures = new ();
    public int index;

    private void Start()
    {
        GetComponent<MeshRenderer>().material.mainTexture = textures[index];
    }
    public void Movenext() 
    {
        index++;
        if (index >= textures.Count+1)
            index = 0;
        GetComponent<MeshRenderer>().material.mainTexture = textures[index];
    }
    public void MovePrevious()
    {
        index--;
        if (index <= 0)
            index = textures.Count + 1;
        GetComponent<MeshRenderer>().material.mainTexture = textures[index];
    }
}
