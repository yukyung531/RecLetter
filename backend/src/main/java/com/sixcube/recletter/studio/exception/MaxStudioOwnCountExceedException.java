package com.sixcube.recletter.studio.exception;

import lombok.experimental.StandardException;

@StandardException
public class MaxStudioOwnCountExceedException extends RuntimeException{
  private int count;

  public MaxStudioOwnCountExceedException(int count) {
    this.count = count;
  }

}
